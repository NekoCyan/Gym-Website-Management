from rest_framework import serializers
from .models import Trainer,Attendance,ExerciseChart,DietChart
from django.contrib.auth import get_user_model

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = ['email', 'password', 'full_name', 'gender', 'address', 'phone_number']
        extra_kwargs = {'password': {'write_only': True}}

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = ['full_name', 'gender', 'address', 'phone_number']
        
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
        
class ExerciseChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseChart
        fields = '__all__'

class DietChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietChart
        fields = '__all__'
