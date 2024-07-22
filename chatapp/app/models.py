from django.contrib.auth.models import User
from django.db import models

class Interest(models.Model):
    sender = models.ForeignKey(User, related_name='interests_sent', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='interests_received', on_delete=models.CASCADE)
    message = models.TextField()
    accepted = models.BooleanField("Accepted", default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.sender}"

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.sender}"
