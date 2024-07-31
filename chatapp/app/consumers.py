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

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        messages = async_to_sync(self.fetch_chat_history)(self.room_name)
        for message in messages:
            self.send(text_data=self.parse_msg_josn(message))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        json_data = json.loads(text_data)
        message = json_data['message']
        sender_username = json_data['sender']
        receiver_username = json_data['receiver']

        sender = async_to_sync(self.get_user)(sender_username)
        receiver = async_to_sync(self.get_user)(receiver_username)

        async_to_sync(self.save_message)(sender, receiver, message)
        
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.parse_user_object(sender),
                'receiver': self.parse_user_object(receiver),
                'timestamp': str(self.get_current_timestamp()),
            }
        )

    def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        receiver = event['receiver']
        timestamp = event['timestamp']

        self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'receiver': receiver,
            'timestamp': timestamp
        }))

    @database_sync_to_async
    def save_message(self, sender, receiver, message):
        return Message.objects.create(
            sender=sender,
            receiver=receiver,
            message=message
        )

    def parse_msg_josn(self, msg):
        return json.dumps({
            'message': msg.message,
            'sender': self.parse_user_object(msg.sender),
            'receiver': self.parse_user_object(msg.receiver),
            'timestamp': str(msg.timestamp)
        })
    
    def parse_user_object(self, obj):
        return {
            "id": obj.id,
            "first_name": obj.first_name,
            "last_name": obj.last_name,
            "email": obj.email,
            "username": obj.username,
        }

    @database_sync_to_async
    def fetch_chat_history(self, room_name):
        user1_username, user2_username = room_name.split('_')
        user1 = User.objects.get(username=user1_username)
        user2 = User.objects.get(username=user2_username)
        return Message.objects.filter(
            (Q(sender=user1) & Q(receiver=user2)) |
            (Q(sender=user2) & Q(receiver=user1))
        ).order_by('timestamp')

    @database_sync_to_async
    def get_user(self, username):
        return User.objects.get(username=username)

    def get_current_timestamp(self):
        from django.utils import timezone
        return timezone.now()


class ConsumerStatus(WebsocketConsumer):
    def connect(self):
        user = self.scope['user']
        

        if user and user.is_authenticated:
            
            async_to_sync(self.update_user_status)(user, True)

            async_to_sync(self.channel_layer.group_add)(
                "online_users",
                self.channel_name
            )
            online_users = async_to_sync(self.online_user_ids)()
            print("online_users",online_users)
            async_to_sync(self.channel_layer.group_send)(
                "online_users",
                {
                    'type': 'user_status',
                    'user_ids': online_users,
                    'is_online': True
                }
            )
            print(f"User {user.username} added to online_users group")

        self.accept()

    def disconnect(self, close_code):
        user = self.scope['user']
        print("Disconnect User:",
                user.username if user.is_authenticated else "Anonymous")

        if user.is_authenticated:
            async_to_sync(self.update_user_status)(user, False)

            online_users = async_to_sync(self.online_user_ids)()
            print("online_users",online_users)
            async_to_sync(self.channel_layer.group_send)(
                "online_users",
                {
                    'type': 'user_status',
                    'user_ids': online_users,
                    'is_online': True
                }
            )
            async_to_sync(self.channel_layer.group_discard)(
                "online_users",
                self.channel_name
            )
            print(f"User {user.username} removed from online_users group")

    def user_status(self, event):
        print('Event:', event)
        self.send(text_data=json.dumps({
            'user_ids': event['user_ids'],
            'is_online': True
        }))

    @database_sync_to_async
    def update_user_status(self, user, is_online):
        obj, created = UserProfile.objects.get_or_create(user=user)
        obj.is_online = is_online
        obj.save()
    
    @database_sync_to_async
    def online_user_ids(self):
        ids = list(UserProfile.objects.filter(is_online=True).values_list("user_id", flat=True))
        return ids
