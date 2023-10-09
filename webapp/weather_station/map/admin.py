from django.contrib import admin
from .models import Weather_Stations

# Register your models here.
admin.site.register(Weather_Stations)

# class CustomUser(UserAdmin):
#     list_display = ('username', 'email', 'id')
#     readonly_fields = ('id',)

# admin.site.register(CustomUser)