from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='userprofile')
    is_online = models.BooleanField(default=False)
    
    class Meta:
        verbose_name_plural="UserProfile"
    
    def __str__(self):
        return bool(self.is_online)

class Interest(models.Model):
    STATUS_CHOICES=(
        ("sent", "Sent"),
        ("canceled", "Canceled"),
    )
    sender = models.ForeignKey(User, related_name='interests_sent', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='interests_received', on_delete=models.CASCADE)
    accepted = models.BooleanField("Accepted", default=False)
    status = models.CharField("Status", max_length=12, default="sent", choices=STATUS_CHOICES, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.sender}|{self.receiver}"

class Message(models.Model):
    STATUS_CHOICES=(
        ("new", "New"),
        ("seen", "Seen"),
        ("deleted", "Deleted"),
    )
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    message = models.TextField()
    status = models.CharField("Status", max_length=12, default="new", choices=STATUS_CHOICES, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f'{self.sender} to {self.receiver}: {self.message}'
