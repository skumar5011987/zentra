from django.conf import settings
from elasticsearch import Elasticsearch

def get_client():
    return Elasticsearch(
        settings.ELASTIC_SERVER_URL,
        http_auth= (settings.ELASTIC_USERNAME, settings.ELASTIC_PASS)
    )