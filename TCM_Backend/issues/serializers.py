from rest_framework import serializers
from .models import Issue


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = [
            'id', 'testcase_id', 'task_id', 'title', 'description',
            'issue_type', 'status', 'priority', 'severity',
            'created_by_id', 'created_at', 'project_id', 'linked_execution_id',
        ]
