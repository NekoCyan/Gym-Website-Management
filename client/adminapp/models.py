from django.db import models

# Create your models here.
class User(models.Model):
    email = models.EmailField(unique=True)
    fullName = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=255, blank=True)
    phoneNumber = models.CharField(max_length=255, blank=True)
    photo = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=255, blank=True)
    balance = models.IntegerField(default=0)
    totalBalance = models.IntegerField(default=0)
