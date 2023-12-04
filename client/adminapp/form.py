
from django import forms
from .enums import ROLES, GENDER

class UserForm(forms.Form):
    type_id = forms.ChoiceField(choices=ROLES.choices())
    name = forms.CharField()
    gender = forms.ChoiceField(choices=GENDER.choices())
    email = forms.EmailField()
    address = forms.CharField()
    mobile = forms.CharField()
    photo = forms.ImageField()
    id_proof = forms.FileField()
    password = forms.CharField(widget=forms.PasswordInput)
    cnfrmpassword = forms.CharField(widget=forms.PasswordInput)
