from django import forms

class DateForm(forms.Form):
    time_frame_start = forms.DateTimeField(label="Time frame start")
    time_frame_stop = forms.DateTimeField(label="Time frame end")