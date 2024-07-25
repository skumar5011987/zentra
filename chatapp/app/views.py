import json
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from app.models import Interest, Message
from app.utils import get_user_data
from app.serializers import InterestSerializer, MessageSerializer, UserSerializer


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        username = data.get('username', "").lower()
        password = data.get('password')
        if not username or not password:
            return Response({"error": "Please provide both Username and password"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password, email=email, first_name=data.get(
            "firstname"), last_name=data.get("lastname"))
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": get_user_data(user),
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
        })


class LogoutAPIViw(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Unable to logout"}, status=status.HTTP_400_BAD_REQUEST)


class GetUsersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        id = request.query_params.get('user_id')
        sender = request.user
        try:
            if id:
                user = User.objects.get(id=id)
                serializer = UserSerializer(user)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            else:
                sent_ids = Interest.objects.filter(
                    sender=sender).values_list('receiver_id', flat=True)
                received_ids = Interest.objects.filter(
                    receiver=sender).values_list('sender_id', flat=True)
                all_ids = list(set(sent_ids) | set(received_ids))

                users = User.objects.exclude(
                    Q(id__in=all_ids) | Q(id=sender.id))
                serializer = UserSerializer(users, many=True)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error: {e}")
        return Response(data={}, status=status.HTTP_200_OK)


class GetFriendsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        sender_ids = list(Interest.objects.filter(
            sender=user, accepted=True).values_list('receiver_id', flat=True))
        receiver_ids = list(Interest.objects.filter(
            receiver=user, accepted=True).values_list('sender_id', flat=True))
        friends = User.objects.filter(
            id__in=list(set(sender_ids + receiver_ids))).select_related('userprofile')
        serializer = UserSerializer(friends, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class GetRequestedUsersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            ids1 = list(Interest.objects.filter(receiver=user,
                        accepted=False).values_list('sender_id', flat=True))
            ids2 = list(Interest.objects.filter(
                sender=user, accepted=False).values_list('receiver_id', flat=True))
            qs1 = User.objects.filter(id__in=ids1)
            qs2 = User.objects.filter(id__in=ids2)

            s1 = UserSerializer(qs1, many=True)
            s2 = UserSerializer(qs2, many=True)
            data = {
                "received": s1.data,
                "send": s2.data
            }
            return Response(data=data, status=status.HTTP_200_OK)
        except Exception as exc:
            print(f"Error: {exc}")
            return Response({"error": "Can't get Interests"}, status=status.HTTP_400_BAD_REQUEST)


class InterestsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            interests = Interest.objects.filter(sender=user, accepted=False)
            serializer = InterestSerializer(interests, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Something gone wrong. error:{e}")
            return Response(data={})

    def post(self, request):
        data = request.data
        sender = request.user
        receiver_id = data.get('receiver')
        try:
            receiver = User.objects.get(id=receiver_id)
            interest = Interest.objects.filter(
                sender=sender, receiver=receiver).first()
            if not interest:
                data['sender'] = sender.id
                serializer = InterestSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(data=serializer.data, status=status.HTTP_200_OK)
            else:
                interest.status = "sent"
                interest.accepted = False
                interest.save()
                serializer = InterestSerializer(interest)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Receiver DoesNotExist"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = request.data
        user = request.user
        interest_id = data.get('interest_id')
        try:
            qs = Interest.objects.filter(
                Q(sender_id=interest_id) | Q(receiver_id=interest_id))
            qs.update(accepted=True)
            return Response(status=status.HTTP_200_OK)
        except Interest.DoesNotExist as e:
            return Response({"error": "Interest DoesNotExist"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        interest_id = request.data.get('interest_id')
        try:
            Interest.objects.filter(Q(sender_id=interest_id) | Q(
                receiver_id=interest_id)).delete()
            return Response({"message": "success"}, status=status.HTTP_201_CREATED)
        except Interest.DoesNotExist as e:
            print(f"error: {e}")
            return Response({"error": "Interest DoesNotExist"}, status=status.HTTP_400_BAD_REQUEST)


class MessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, friend_id):
        user = request.user
        # receiver_id = data.get("receiver")
        if not friend_id:
            return Response({"error": "Receiver ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            
            messages = Message.objects.filter(
                sender=user, receiver_id=friend_id).exclude(status="deleted")
            serializer = MessageSerializer(messages, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"error:{e}")
            return Response(data={}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, friend_id):
        data = request.data
        sender = request.user
        data['receiver'] = friend_id
        if not friend_id:
            return Response({"error": "Receiver ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            data['sender'] = sender.id
            serializer = MessageSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"error:{e}")
            return Response({"error": "Unable to sent message"}, status=status.HTTP_400_BAD_REQUEST)
