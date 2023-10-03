from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from map.models import Weather_Stations


# Create your models here.
class Weather(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, related_name="created_by", blank=True, null=True)
    weather_station = models.ForeignKey(Weather_Stations, on_delete=models.SET_NULL, related_name="station", blank=True, null=True)
    time = models.DateTimeField(auto_now_add=True)
    temperature = models.FloatField()
    humidity = models.FloatField()
    wind_speed = models.FloatField()
    light_intensity = models.FloatField()
