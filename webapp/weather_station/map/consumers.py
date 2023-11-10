from mqttasgi.consumers import MqttConsumer

from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync
from channels.consumer import SyncConsumer
from channels.layers import get_channel_layer
import paho.mqtt.client as mqtt

from django.conf import settings
import django
import os
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'weather_station.settings')

django.setup()

from .models import Weather
from django.contrib.auth.models import User
from .models import Weather_Stations

channel_layer = get_channel_layer()


class WSConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]
        self.room_group_name = "weather"
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {"type": "weather.message", "message": text_data}
                )

    def weather_message(self, event):
        message = event["message"]
        self.send(text_data=json.dumps(message))

    def disconnect(self, code):
        print("Disconnected from server.")
        pass

class MyMqttConsumer(MqttConsumer):

    async def connect(self):
        self.channel_layer = get_channel_layer()
        self.room_group_name = "weather"
        await self.channel_layer.group_add(
                self.room_group_name, self.channel_name
                )
        await self.subscribe('weather', 2)
        await self.subscribe('test', 2)

    async def receive(self, mqtt_message):
        try:
            print('Received a message at topic:', mqtt_message['topic'])
            print('With payload', mqtt_message['payload'])
            print('And QOS:', mqtt_message['qos'])
            jdata = json.loads(mqtt_message['payload'])
            u = await sync_to_async(User.objects.get)(username=jdata["user"])
            s = await sync_to_async(Weather_Stations.objects.get)(id=jdata["weather_station"])
        except Exception as e:
            print("EXCEPTION: ", e)
        try:
            print(jdata)
            
            w1 = await sync_to_async(Weather.objects.create)(user=u, weather_station=s, data=jdata["data"])
            await self.channel_layer.group_send(
                "{}".format(self.room_group_name),
                {"type": "weather_message", "message": jdata}
            )

        except Exception as e:
            print(e)
        pass
    
    async def disconnect(self):
        await self.unsubscribe('weather')

    async def weather_message(self, event):
        pass

