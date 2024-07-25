from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)

from app.views import (InterestsAPIView, MessagesAPIView, RegisterAPIView,GetUsersAPIView,GetRequestedUsersAPIView,
                        GetFriendsAPIView, LogoutAPIViw)


urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path('interests/', InterestsAPIView.as_view(), name='interests'),
    path('messages/<int:friend_id>/', MessagesAPIView.as_view(), name='messages'),
    path("users/", GetUsersAPIView.as_view(), name="get_users"),
    path("requested/", GetRequestedUsersAPIView.as_view(), name="requested"),
    path("friends/", GetFriendsAPIView.as_view(), name="friends"),
    path("signout/", LogoutAPIViw.as_view(), name="logout"),
    path('token/', TokenObtainPairView.as_view(), name='access_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
]