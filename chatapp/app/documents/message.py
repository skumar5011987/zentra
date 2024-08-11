from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from app.models import Message


@registry.register_document
class MessageDocument(Document):
    sender = fields.ObjectField(
        properties={
        "id": fields.KeywordField(),
        "username": fields.TextField(),
        "first_name":fields.TextField(),
        "last_name": fields.TextField(),
        "email": fields.TextField(),
    })
    receiver = fields.ObjectField(
        properties={
        "id": fields.KeywordField(),
        "username": fields.TextField(),
        "first_name":fields.TextField(),
        "last_name": fields.TextField(),
        "email": fields.TextField(),
    })
    
    def prepare_sender(self, instance):
        try:
            return {
                "id": instance.sender.id,
                "username": instance.sender.username,
                "first_name": instance.sender.first_name or "",
                "last_name": instance.sender.last_name or "",
                "email": instance.sender.email or ""
            }
        except:
            return {}
    
    def prepare_receiver(self, instance):
        try:
            return {
                "id": instance.receiver.id,
                "username": instance.receiver.username,
                "first_name": instance.receiver.first_name or "",
                "last_name": instance.receiver.last_name or "",
                "email": instance.receiver.email or ""
            }
        except:
            return {}
    
    
    class Index:
        name="messages"
        settings = {
            "number_of_shards":1,
            "number_of_replicas":0
        }
    
    class Django:
        model=Message
        fields=[
            "id",
            "message",
            "status",
            "timestamp",
        ]