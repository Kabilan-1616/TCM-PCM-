from rest_framework import serializers
from .models import TestPlan, Build


class TestPlanSerializer(serializers.ModelSerializer):
    project_id = serializers.IntegerField()

    class Meta:
        model = TestPlan
        fields = [
            'id', 'testplan_name', 'plandesc_name', 'plandesc_pmtid',
            'plandesc_tested', 'plandesc_nottested', 'plandesc_references',
            'plandesc_esttime', 'plan_active', 'project_id',
        ]

    def create(self, validated_data):
        return TestPlan.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class BuildSerializer(serializers.ModelSerializer):
    testplan_id = serializers.IntegerField()

    class Meta:
        model = Build
        fields = ['id', 'build_version', 'build_desc', 'build_releaseDate',
                  'build_active', 'build_open', 'testplan_id']

    def create(self, validated_data):
        return Build.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance