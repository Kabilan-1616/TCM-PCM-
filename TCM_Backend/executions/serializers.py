from rest_framework import serializers
from .models import TestExecution, TestExecutionStep, Bug


class StepExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestExecutionStep
        fields = ['id', 'step_no', 'action', 'expected_result', 'actual_result', 'status', 'bug_id_ref']


class TestExecutionSerializer(serializers.ModelSerializer):
    step_results = StepExecutionSerializer(many=True, read_only=True)

    class Meta:
        model = TestExecution
        fields = ['id', 'testplan_id', 'testcase_id', 'build_id', 'status', 'notes',
                  'attachment_path', 'executed_at', 'executed_by_id', 'step_results']


class TestExecutionReportSerializer(serializers.ModelSerializer):
    testcase_name = serializers.SerializerMethodField()
    build_version = serializers.SerializerMethodField()
    bug_key = serializers.SerializerMethodField()

    class Meta:
        model = TestExecution
        fields = ['id', 'testcase_id', 'testcase_name', 'build_version', 'status', 'notes', 'executed_at', 'bug_key']

    def get_testcase_name(self, obj):
        return obj.testcase.testcase_name if obj.testcase else 'N/A'

    def get_build_version(self, obj):
        return obj.build.build_version if obj.build else 'N/A'

    def get_bug_key(self, obj):
        # Bug has a reverse FK from Bug to TestExecution
        # So we query bugs pointing to this execution
        try:
            bug = Bug.objects.filter(execution=obj).first()
            return bug.bug_key if bug else None
        except:
            return None
