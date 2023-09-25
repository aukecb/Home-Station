from django.contrib.auth.models import User, Group
from .models import Weather
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class WeatherSerializer(serializers.ModelSerializer):
    last_weather = serializers.SerializerMethodField('get_last')

    def last_weather(self, obj):
        w = Weather.objects.last()
        serializer = WeatherSerializer(instance=w, many=True)
        return serializer.data
    class Meta:
        model = Weather
        fields = ['id', 'time', 'temperature', 'humidity', 'wind_speed', 'light_intensity']
