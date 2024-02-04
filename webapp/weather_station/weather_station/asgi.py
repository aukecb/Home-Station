"""
ASGI config for weather_station project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'weather_station.settings')

django.setup()

from map.routing import channel_routing
from map.consumers import MyMqttConsumer

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': URLRouter(channel_routing),
    'mqtt': MyMqttConsumer.as_asgi()
})
