from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)
from app.views import (InterestsAPIView, MessagesAPIView,)


urlpatterns = [
    path('interests/', InterestsAPIView.as_view(), name='interests'),
    path('messages/', MessagesAPIView.as_view(), name='messages'),
    path('token/', TokenObtainPairView.as_view(), name='access_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
]