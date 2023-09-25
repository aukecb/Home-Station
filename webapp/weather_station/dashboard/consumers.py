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

channel_layer = get_channel_layer()


class TestConsumers(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]
        self.room_group_name = "weather"
        print(self.room_group_name)
        print(self.channel_name)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def receive(self, text_data):
        print(text_data)
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


class PahoMqttConsumer(AsyncWebsocketConsumer):
    def __init__(self):
        print("CONNECTING TO MQTT")
        self.topic = "test"  # Replace with your MQTT topic
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        # self.client.username_pw_set(username=settings.MQTT_USERNAME, password=settings.MQTT_PASSWORD)

    async def connect(self):
        print("CONNECTING TO MQTT")

        # Connect to the MQTT broker
        # self.client.connect(settings.MQTT_BROKER_HOST, settings.MQTT_BROKER_PORT, keepalive=60)
        # self.topic = "test"  # Replace with your MQTT topic
        # self.client.loop_start()
        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_add("weather", "test")
        self.client.connect(settings.MQTT_BROKER_HOST, settings.MQTT_BROKER_PORT, keepalive=60)
        self.client.loop_start()
        self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.topic, self.channel_name)
        self.client.loop_stop()
        self.client.disconnect()

    async def receive(self, text_data):
        # This method handles WebSocket messages received from the client
        print( "RECEIEVBD")
        print(text_data)
        pass

    def on_connect(self, client, userdata, flags, rc):
        print(f"Connected to MQTT broker with result code {rc}")
        self.client.subscribe(self.topic)

    def on_message(self, client, userdata, msg):
        message = msg.payload.decode("utf-8")
        print(f"Received message on topic {msg.topic}: {message}")
        # Send the MQTT message to the WebSocket client
        # await self.channel_layer.group_send(
        #     "{}".format(self.room_group_name),
        #     {"type": "weather_message", "message": message}
        # )
        self.channel_layer.group_send(
                "{}".format("weather"), 
                {"type": "weather_message", "message": json.dumps({'message': message})})
        self.send(text_data=json.dumps({
            'message': message
        }))

    def start(self):
        self.connect()

    def stop(self):
        self.disconnect()

class MyMqttConsumer(MqttConsumer):

    async def connect(self):
        self.channel_layer = get_channel_layer()
        self.room_group_name = "weather"
        await self.channel_layer.group_add(
                self.room_group_name, self.channel_name
                )
        await self.subscribe('test', 2)

    async def receive(self, mqtt_message):
        try:
            print('Received a message at topic:', mqtt_message['topic'])
            print('With payload', mqtt_message['payload'])
            print('And QOS:', mqtt_message['qos'])
            jdata = json.loads(mqtt_message['payload'])
        except Exception as e:
            print(e)
        try:
            w1 = await sync_to_async(Weather.objects.create)(wind_speed=jdata['wind_speed'],light_intensity=jdata['light_intensity'],humidity=jdata['humidity'],temperature=jdata['temperature'])
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

