from django.urls import path, re_path
from .consumers import ChatConsumer, ConsumerStatus

websocket_urlpatterns = [
    path('ws/chat/<str:room_name>/', ChatConsumer.as_asgi()),
    path('ws/online_users/', ConsumerStatus.as_asgi()),
]
