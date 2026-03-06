from rest_framework import serializers
from .models import Suite, TestCase, TestCaseStep, Keyword


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ['id', 'name']


class TestCaseStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCaseStep
        fields = ['id', 'step_no', 'precondition', 'action', 'expected_result']


class TestCaseSerializer(serializers.ModelSerializer):
    steps = TestCaseStepSerializer(many=True, read_only=True)
    keyword_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False, default=list
    )

    class Meta:
        model = TestCase
        fields = [
            'id', 'suite_id', 'task_id', 'testcase_name', 'testcase_summary',
            'testcase_precondition', 'testcase_status', 'testcase_importance',
            'testcase_executiontype', 'testcase_type', 'steps', 'keyword_ids',
        ]

    def create(self, validated_data):
        keyword_ids = validated_data.pop('keyword_ids', [])
        steps_data = self.initial_data.get('steps', [])
        tc = TestCase.objects.create(**validated_data)
        for step_data in steps_data:
            TestCaseStep.objects.create(testcase=tc, **{
                k: v for k, v in step_data.items() if k in ['step_no', 'precondition', 'action', 'expected_result']
            })
        if keyword_ids:
            tc.keywords.set(keyword_ids)
        return tc

    def update(self, instance, validated_data):
        keyword_ids = validated_data.pop('keyword_ids', None)
        steps_data = self.initial_data.get('steps', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace steps
        instance.steps.all().delete()
        for step_data in steps_data:
            TestCaseStep.objects.create(testcase=instance, **{
                k: v for k, v in step_data.items() if k in ['step_no', 'precondition', 'action', 'expected_result']
            })

        if keyword_ids is not None:
            instance.keywords.set(keyword_ids)
        return instance


class TestCaseLightSerializer(serializers.ModelSerializer):
    """For plan assignment - lightweight"""
    steps = TestCaseStepSerializer(many=True, read_only=True)

    class Meta:
        model = TestCase
        fields = ['id', 'testcase_name', 'testcase_summary', 'testcase_precondition',
                  'testcase_status', 'testcase_importance', 'testcase_executiontype',
                  'testcase_type', 'task_id', 'suite_id', 'steps']


class SuiteSerializer(serializers.ModelSerializer):
    project_id = serializers.IntegerField()

    class Meta:
        model = Suite
        fields = ['id', 'suite_name', 'suite_description', 'project_id']

    def create(self, validated_data):
        return Suite.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class SuiteWithTestcasesSerializer(serializers.ModelSerializer):
    testcases = serializers.SerializerMethodField()

    class Meta:
        model = Suite
        fields = ['id', 'suite_name', 'testcases']

    def get_testcases(self, obj):
        return [{
            'id': tc.id,
            'testcase_name': tc.testcase_name,
            'testcase_status': tc.testcase_status,
            'testcase_importance': tc.testcase_importance,
        } for tc in obj.testcases.all()]
