from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User, Group
from .models import Weather_Stations
from django.forms import ModelForm


class StaffCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    class Meta:
        model = User
        fields = (
            'username',
            'email', 
            'password1',
            'password2'
        )

    def save(self, commit=True):
        user = super(StaffCreationForm, self).save(commit=False)
        user.is_staff = True
        default_group = Group.objects.get(name='default')
        if commit:
            user.save()
        user.groups.add(default_group)
        return user

class StationForm(ModelForm):
    base_url = forms.CharField(label="Your dashboard url", required=False)
    class Meta:
        model = Weather_Stations
        fields = ('latitude', 'longitude', 'base_url')
    