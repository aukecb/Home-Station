from django.db import models

# Create your models here.
class Weather(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(auto_now_add=True)
    temperature = models.FloatField()
    humidity = models.FloatField()
    wind_speed = models.FloatField()
    light_intensity = models.FloatField()
