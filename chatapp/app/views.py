from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from app.models import Interest, Message
from app.utils import get_user_data
from app.serializers import InterestSerializer, MessageSerializer


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        data = request.data
        email = data.get('email')
        username = data.get('username')
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
    def get(self, request):
        pass
    def post(self, request):
        pass
    
    def put(self, request):
        pass


class MessagesAPIView(APIView):
    
    def get(self, request):
        pass
    
    def post(self, request):
        pass