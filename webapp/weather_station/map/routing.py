from django.urls import re_path, path
from channels.routing import ProtocolTypeRouter, URLRouter
from . import consumers
# from channels.routing import channel_routing

channel_routing = [
    re_path(r"ws/", consumers.WSConsumer.as_asgi()),
    re_path(r"ws/", consumers.MyMqttConsumer.as_asgi())
]
