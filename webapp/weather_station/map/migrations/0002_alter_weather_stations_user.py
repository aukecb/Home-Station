# Generated by Django 4.2.5 on 2023-10-13 12:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('map', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='weather_stations',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='owned_by', to=settings.AUTH_USER_MODEL),
        ),
    ]
