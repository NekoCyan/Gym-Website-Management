from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import UserProfile

class SignUpForm(UserCreationForm):
    membership_plan = forms.ModelChoiceField(queryset=MembershipPlan.objects.all(), empty_label=None)

    class Meta:
        model = User
        fields = ('username', 'password1', 'password2', 'membership_plan')