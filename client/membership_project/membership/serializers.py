from rest_framework import serializers
from .models import Member 
import hashlib

class MemberSerializer(serializers.ModelSerializer):
    # Thêm validation cho passwords(độ dài là 20)
    password = serializers.CharField(write_only=True, min_length=20, style={'input_type': 'password'})

    #định dạng lại trường start_at thàng string ngày tháng
    start_at = serializers.DateField(format='%Y-%m-%d')

    class Meta:
        model = Member
        fields = '__all__'    
        extra_kwargs = {
            'password': {
                'write_only': True,
              'style': {'input_type': 'password'}},
            }
    def to_representation(self, instance):
    
        return {
            'id': instance.id,
            'name': instance.name,
            'email': instance.email,
            'password': instance.password,
            'start_at': instance.start_at.strftime('%Y-%m-%d')
        }
    
    def validate_start_at(self, value):
        """
        Validation cho trường start:đảm bảo ngày bắt đầu phải đứng ở đằng trước ngày kết thúc.

        """
        end_at = self.initial_data.get('end_at')
        if end_at and value > end_at:
            raise serializers.ValidationError('Ngày kết thúc phải lớn hơn ngày bắt đầu')
        return value
