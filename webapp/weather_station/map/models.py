from django.db import models

# Create your models here.
class Weather_Stations(models.Model):
    id = models.BigAutoField(primary_key=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    base_url = models.CharField(max_length=50)

