from django.shortcuts import render
from django.http import HttpResponse
from django.apps import apps
from .models import Weather_Stations

# Create your views here.

def index(request):
    print(apps.get_models())
    return render(request, "index.html", context={'stations': Weather_Stations.objects.all()})
