

from rest_framework import serializers
from .models import Project, ProjectMembership
from users.models import User


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ["created_at", "created_by"]


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email","role"]


class ProjectMemberSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(write_only=True)
    user = UserMiniSerializer(read_only=True)

    class Meta:
        model = ProjectMembership
        fields = ["id", "project", "user", "user_email"]
        read_only_fields = ["id", "user"]

    def create(self, validated_data):
        user_email = validated_data.pop("user_email")

        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"user_email": "User with this email does not exist"}
            )

        validated_data["user"] = user
        return super().create(validated_data)
