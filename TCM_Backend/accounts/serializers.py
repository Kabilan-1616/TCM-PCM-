from rest_framework import serializers
from .models import User


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'employee_id', 'name', 'password']


class UserOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'employee_id', 'name', 'role', 'is_active', 'is_admin']
