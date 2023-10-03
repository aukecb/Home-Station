from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.apps import apps
from .models import Weather_Stations
from django.views import generic
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy, reverse
from .forms import StaffCreationForm, StationForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import logout

# Create your views here.

def index(request):
    print(apps.get_models())
    return render(request, "index.html", context={'stations': Weather_Stations.objects.all()})

@login_required
def create_station(request):
    if request.method == 'POST':
        form = StationForm(request.POST)
        if form.is_valid():
            form.save()
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