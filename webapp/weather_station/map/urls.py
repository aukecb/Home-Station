"""
URL configuration for weather_station project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'stations', views.StationViewSet, basename='stations')
router.register(r'weather', views.WeatherViewSet, basename='weather')

urlpatterns = [
    path('', views.index, name='index'),
    path('map/signup/', views.register, name="signup"),
    path('map/setup-station', views.create_station, name="create_station"),
    path('map/login/', views.UserLoginView.as_view(), name="login"),
    path('map/logout/', views.logout_view, name="logout"),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
