from rest_framework.views import APIView
from app.models import Interest, Message
from app.serializers import InterestSerializer, MessageSerializer

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