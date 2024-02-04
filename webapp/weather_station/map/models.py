from django.db import models
from django.conf import settings
# Create your models here.
class Weather_Stations(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="owned_by")
    latitude = models.FloatField()
    longitude = models.FloatField()
    base_url = models.CharField(max_length=50)

    def __str__(self):
        return str(self.user) + str(self.id)

class Weather(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="created_by")
    weather_station = models.ForeignKey(Weather_Stations, on_delete=models.PROTECT, related_name="station", null=False)
    time = models.DateTimeField(auto_now_add=True)
    data = models.JSONField()

    def __str__(self):
        return str(self.user)+ "_" + self.weather_station.__str__() + "_" + str(self.id)
