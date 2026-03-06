# Taiga_backend/issues/serializers.py

from rest_framework import serializers
from .models import Issue


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "severity",
            "issue_type",
            "task_id",
            "testcase_id",
            "linked_execution_id",
            "project",
            "created_by",
            "created_at",
        ]