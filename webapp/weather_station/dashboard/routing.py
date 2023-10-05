from django.urls import re_path, path
from channels.routing import ProtocolTypeRouter, URLRouter
from . import consumers

channel_routing = [
    re_path(r"ws/", consumers.WSConsumer.as_asgi()),
    re_path(r"ws/", consumers.MyMqttConsumer.as_asgi())
]
