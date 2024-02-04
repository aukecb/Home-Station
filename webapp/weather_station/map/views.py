from django.shortcuts import render, redirect
from django.apps import apps
from .models import Weather_Stations
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from .forms import StaffCreationForm, StationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import logout
import django_filters.rest_framework

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import filters

from .models import Weather
from .models import Weather_Stations
from .serializers import UserSerializer, GroupSerializer, WeatherSerializer, StationSerializer
from .forms import *
# Create your views here.

def index(request):
    print(apps.get_models())
    return render(request, "index.html", context={'stations': Weather_Stations.objects.all()})

@login_required
def create_station(request):
    if request.method == 'POST':
        form = StationForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.user = request.user
            obj.save()
            return redirect(index)
    else:
        form = StationForm()
    context = {'form': form}
    return render(request, "stations.html", context)

def register(request):  
    if request.method == 'POST':  
        form = StaffCreationForm(request.POST)  
        if form.is_valid():
            form.save()
            return redirect(index)
    else:  
        form = StaffCreationForm()
    context = {  
        'form':form  
    }  
    return render(request, 'registration/signup.html', context)  

def logout_view(request):
    logout(request)
    return redirect(index)


class UserLoginView(LoginView):
    redirect_authenticated_user = True

    def get_success_url(self):
        return reverse_lazy(index)

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid username or password')
        return self.render_to_response(self.get_context_data(form=form))

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
    filterset_fields = {'id':['exact'], 'user':['exact'], 'weather_station':['exact'], 'time':['exact','gte', 'lte']}
    permission_classes = []

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        layer = get_channel_layer()
        async_to_sync(layer.group_send)("weather", {"type": "weather.message", "message": serializer.data})
