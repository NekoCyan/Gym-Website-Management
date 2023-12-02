from django.db import models

# Create your models here.
class Member(models.Model):
    id = models.IntegerField(primary_key=True, unique= True)
    password = models.CharField(max_length=255, validators=[vars.PasswordValidator])
    is_trainer = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
class Member(models.Model):
    class Roles(models.IntegerChoices):
        USER= 0, 'User'
        TRAINER = 1, 'Trainer'
        ADMIN = 2, 'ADMIn'
        
    class Genders(models.IntegerChoices):
        UNKNOWN = -1, 'Unknown'
        FEMALE = 0, 'Female'
        MALE = 1, 'Male'
    class Transactionstatus(models.IntegerChoices):
        PENDING = 0, 'Pending'
        SUCCEED = 1, 'Succeed'
        FAILED = 2, 'Failed'
        CANCELLED = 3, 'Cancelled'
        
    Name = models.CharField(max_length=255)
    Roles = models.IntegerField(choices = Roles.choices)
    Genders = models.IntegerField(choices = Genders.choices, default=Genders.UNKNOWN)
    Transactionstatus = models.IntegerField(choices= Transactionstatus.choices, default=Transactionstatus.PENDING)
    
    def __str__(self) -> str:
        return super().__str__()
    
