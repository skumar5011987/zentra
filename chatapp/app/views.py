from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from app.models import Interest, Message
from app.utils import get_user_data
from app.serializers import InterestSerializer, MessageSerializer


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        data = request.data
        email = data.get('email')
        username = data.get('username',"").lower()
        password = data.get('password')
        if not username or not password:
            return Response({"error": "Please provide both Username and password"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password, email=email, first_name=data.get("first_name"), last_name=data.get("last_name"))
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": get_user_data(user),
            'refresh_token': str(refresh),
            'access_token': str(refresh.access_token),
        })
        
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
            interest = Interest.objects.filter(sender=sender, receiver=receiver).get()
            if not interest:
                data['sender']= sender.id
                serializer = InterestSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(data = serializer.data, status=status.HTTP_200_OK)
            else:
                interest.status = "sent"
                interest.accepted=False
                interest.save()
                serializer = InterestSerializer(interest)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error":"Receiver DoesNotExist"}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        data = request.data
        user = request.user
        interest_id = data.get('interest_id')
        try:
            interest = Interest.objects.get(id=interest_id)
            interest.accepted = True
            interest.save()
            return Response(status=status.HTTP_200_OK)
        except Interest.DoesNotExist as e:
            return Response({"error":"Interest DoesNotExist"}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        interest_id = request.data.get('interest_id')
        try:
            interest = Interest.objects.get(id=interest_id)
            interest.status = "canceled"
            interest.save()
            serializer = InterestSerializer(interest)
            return Response(data = serializer.data, status=status.HTTP_201_CREATED)
        except Interest.DoesNotExist as e:
            print(f"error: {e}")
            return Response({"error":"Interest DoesNotExist"}, status=status.HTTP_400_BAD_REQUEST)


class MessagesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        data = request.GET
        user = request.user
        receiver_id = data.get("receiver")
        if not receiver_id:
            return Response({"error":"Receiver ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            receiver = User.objects.get(id=receiver_id)
            messages = Message.objects.filter(sender=user, receiver=receiver).exclude(status="deleted")
            serializer = MessageSerializer(messages, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"error:{e}")
            return Response(data={}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        data = request.data
        sender = request.user
        receiver_id = data.get("receiver")
        if not receiver_id:
            return Response({"error":"Receiver ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            data['sender'] = sender.id
            serializer = MessageSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"error:{e}")
            return Response({"error":"Unable to sent message"}, status=status.HTTP_400_BAD_REQUEST)