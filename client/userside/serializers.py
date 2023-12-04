from rest_framework import serializers
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

class RegisterSerializer(serializers.Serializer):
    mname = serializers.CharField()
    gender = serializers.CharField()
    email = serializers.EmailField()
    address = serializers.CharField()
    mobile = serializers.CharField()
    photo = serializers.ImageField()
    id_proof = serializers.FileField()
    password = serializers.CharField()
    cnfrmpassword = serializers.CharField()
    plan = serializers.IntegerField()
    term = serializers.BooleanField()
 
class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = get_user_model()
        fields = ('id', 'email', 'password', 'first_name', 'last_name')  
        
class LoginSerializer(serializers.Serializer):
    useremail = serializers.EmailField()
    userpassword = serializers.CharField()
    type = serializers.CharField()