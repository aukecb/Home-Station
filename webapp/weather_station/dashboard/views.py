from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User, Group
import django_filters.rest_framework

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import filters, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Weather
from map.models import Weather_Stations
from .serializers import UserSerializer, GroupSerializer, WeatherSerializer, StationSerializer
from .forms import *
import datetime as dt

# Create your views here.

def index_all(request):
    start_date = dt.datetime.now() - dt.timedelta(minutes=15)
    end_date = dt.datetime.now()
    today = [dt.datetime.today().time().min, dt.datetime.today().time().max]
    if request.user.is_authenticated:
        context ={
            "data": Weather.objects.filter(user=request.user)
        }
    else:
        context = {
            "data": Weather.objects.all()
        }
    return render(request, "dashboard/index2.html", context=context)

def index(request, user):
    start_date = dt.datetime.now() - dt.timedelta(minutes=15)
    end_date = dt.datetime.now()
    today = [dt.datetime.today().time().min, dt.datetime.today().time().max]
    data = Weather.objects.filter(user=user)
    context = {
        "data": data
    }
    return render(request, "dashboard/index2.html", context=context)

def getdata(request):
    if request.method == "POST":
        form = DateForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect("/")
    else:
        form = DateForm()
    print(form)
    return render(request, "dashboard/index2.html", {"form": form})

class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class StationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Weather_Stations.objects.all()
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {'id':['exact'], 'user':['exact'], 'base_url':['exact']}
    serializer_class = StationSerializer


class WeatherViewSet(viewsets.ModelViewSet):
    queryset = Weather.objects.all()
    serializer_class = WeatherSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {'id':['exact'], 'user':['exact'], 'weather_station':['exact'], 'time__time':['exact','gte', 'lte', 'exact']}
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
