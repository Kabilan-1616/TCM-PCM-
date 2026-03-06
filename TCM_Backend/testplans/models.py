from django.db import models
from projects.models import Project
from testcases.models import TestCase


class TestPlan(models.Model):
    testplan_name = models.CharField(max_length=100)
    plandesc_name = models.CharField(max_length=100, blank=True, null=True)
    plandesc_pmtid = models.CharField(max_length=10, blank=True, null=True)
    plandesc_tested = models.CharField(max_length=200, blank=True, null=True)
    plandesc_nottested = models.CharField(max_length=200, blank=True, null=True)
    plandesc_references = models.CharField(max_length=200, blank=True, null=True)
    plandesc_esttime = models.CharField(max_length=100, blank=True, null=True)
    plan_active = models.BooleanField(default=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='testplans')
    testcases = models.ManyToManyField(TestCase, blank=True, db_table='testplan_testcase', related_name='testplans')

    class Meta:
        db_table = 'testplans'

    def __str__(self):
        return self.testplan_name


class Build(models.Model):
    build_version = models.CharField(max_length=100)
    build_desc = models.CharField(max_length=500, blank=True, null=True)
    build_active = models.BooleanField(default=True)
    build_open = models.BooleanField(default=True)
    build_releaseDate = models.DateField()
    testplan = models.ForeignKey(TestPlan, on_delete=models.CASCADE, related_name='builds')

    class Meta:
        db_table = 'builds'

    def __str__(self):
        return self.build_version
