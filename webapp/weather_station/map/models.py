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

