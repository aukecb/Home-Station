from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from map.models import Weather_Stations


# Create your models here.
class Weather(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="created_by")
    weather_station = models.ForeignKey(Weather_Stations, on_delete=models.PROTECT, related_name="station", null=False)
    time = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()

    def __str__(self):
        return str(self.user)+ "_" + self.weather_station.__str__() + "_" + str(self.id)
