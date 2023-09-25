from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User, Group
import django_filters.rest_framework

from rest_framework import viewsets
from rest_framework import permissions
from rest_framework import filters, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Weather
from .serializers import UserSerializer, GroupSerializer, WeatherSerializer
from .forms import *
import datetime as dt

# Create your views here.

def index(request):
    # return HttpResponse(" test 12234")
    start_date = dt.datetime.now() - dt.timedelta(minutes=15)
    end_date = dt.datetime.now()
    today = [dt.datetime.today().time().min, dt.datetime.today().time().max]
    # print(start_date)
    context = {
        "data":Weather.objects.all()
    }
    # print("TTTTTTEST", context['data'][0].id)
    # print("TTTTTTEST", list(context['data'])[-1].id)
    # print("TTTESTT", len(context['data']))
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
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class WeatherViewSet(viewsets.ModelViewSet):
    queryset = Weather.objects.all()
    serializer_class = WeatherSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {'id':['exact'], 'time__time':['exact','gte', 'lte', 'exact'], 'humidity':['exact']}
    # ordering_fields = ['id', 'time']

    @action(detail=True, methods=['get'])
    def last(self, request, pk=None):
        l = Weather.objects.last()
        serializer = WeatherSerializer(data=l)
        return Response(serializer.data)


    # permission_classes = [permissions.IsAuthenticated]
