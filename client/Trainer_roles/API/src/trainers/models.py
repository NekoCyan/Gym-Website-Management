from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, AbstractUser
from django.contrib.auth import get_user_model
from .enums import ROLES, GENDER

class TrainerManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Trường email phải được đặt đầy đủ')
        email = self.normalize_email(email)
        trainer = self.model(email=email, **extra_fields)
        trainer.set_password(password)
        trainer.save(using=self._db)
        return trainer

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_trainer', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class Trainer(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    gender = models.IntegerField(choices=GENDER, default=GENDER.UNKNOWN)
    address = models.TextField()
    phone_number = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    roles = models.IntegerField(choices=ROLES, default=ROLES.USER)
    
    objects = TrainerManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'gender', 'address', 'phone_number']

    def __str__(self):
        return self.email

class Attendance(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, null=True, blank=True)
    
class ExerciseChart(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    exercise_date = models.DateField()
    exercise_details = models.TextField()
    video_link = models.URLField()

class DietChart(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    diet_date = models.DateField()
    diet_details = models.TextField()
    calories_goal = models.PositiveIntegerField()

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ('member', 'Member'),
        ('admin', 'Admin'),
        ('trainer', 'Trainer'),
    ]

    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='trainer')
    points = models.IntegerField(default=0)