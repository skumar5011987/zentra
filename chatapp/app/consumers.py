from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db.models import Q, DateTimeField
from .models import UserProfile, Message
import json

User = get_user_model()


class ChatConsumer(WebsocketConsumer):
    
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        messages = self.fetch_chat_history(self.room_name)
        for message in messages:
            self.send(text_data=json.dumps({
                'message': message.message,
                'sender': self.parse_user_object(message.sender),
                'receiver': self.parse_user_object(message.receiver),
                'timestamp': str(message.timestamp)
            }))

    def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        json_data = json.loads(text_data)
        message = json_data['message']
        sender_username = json_data['sender']
        receiver_username = json_data['receiver']

        sender = self.get_user(sender_username)
        receiver = self.get_user(receiver_username)

        self.save_message(sender, receiver, message)

        self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender.username,
                'timestamp': str(self.get_current_timestamp())
            }
        )

    def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        timestamp = event['timestamp']

        self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'timestamp': timestamp
        }))

    
    def save_message(self, sender, receiver, message):
        return Message.objects.create(
            sender=sender,
            receiver=receiver,
            message=message
        )

    def parse_user_object(self, obj):
        return {
            "id":obj.id,
            "first_name":obj.first_name,
            "last_name":obj.last_name,
            "email":obj.email,
            "username":obj.username,
        }
        
    def fetch_chat_history(self, room_name):
        user1_username, user2_username = room_name.split('_')
        user1 = User.objects.get(username=user1_username)
        user2 = User.objects.get(username=user2_username)
        return Message.objects.filter(
            (Q(sender=user1) & Q(receiver=user2)) |
            (Q(sender=user2) & Q(receiver=user1))
        ).order_by('timestamp')

    
    def get_user(self, username):
        return User.objects.get(username=username)

    
    def get_current_timestamp(self):
        from django.utils import timezone
        return timezone.now()

class ConsumerStatus(WebsocketConsumer):
    
    def connect(self):
        user = self.scope['user']
        
        if user.is_authenticated:
            database_sync_to_async(UserProfile.objects.filter(user=user).update(is_online=True))
            
            self.channel_layer.group_add(
                "online_users",
                self.channel_name
            )
            self.channel_layer.group_send(
                "online_users",
                {
                    'type': 'user_status',
                    'user_id': user.id,
                    'is_online': True
                }
            )
        self.accept()

    def disconnect(self, close_code):
        user = self.scope['user']
        if user.is_authenticated:
            database_sync_to_async(UserProfile.objects.filter(user=user).update(is_online=True))

            self.channel_layer.group_send(
                "online_users",
                {
                    'type': 'user_status',
                    'user_id': user.id,
                    'is_online': False
                }
            )
            self.channel_layer.group_discard(
                "online_users",
                self.channel_name
            )
            

    def user_status(self, event):
        self.send(text_data=json.dumps({
            'user_id': event['user_id'],
            'is_online': event['is_online']
        }))

    @database_sync_to_async
    def update_user_status(self, user, is_online):
        UserProfile.objects.filter(user=user).update(is_online=is_online)
