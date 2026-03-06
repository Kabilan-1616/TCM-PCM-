from django.db import models
from testplans.models import TestPlan, Build
from testcases.models import TestCase
from accounts.models import User


class TestExecution(models.Model):
    testplan = models.ForeignKey(TestPlan, on_delete=models.SET_NULL, null=True)
    testcase = models.ForeignKey(TestCase, on_delete=models.SET_NULL, null=True)
    build = models.ForeignKey(Build, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=50, default='Not Run')
    notes = models.TextField(blank=True, null=True)
    attachment_path = models.CharField(max_length=500, blank=True, null=True)
    executed_at = models.DateTimeField(auto_now_add=True)
    executed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'test_executions'

    def __str__(self):
        return f"Execution {self.id} - {self.status}"


class TestExecutionStep(models.Model):
    execution = models.ForeignKey(TestExecution, on_delete=models.CASCADE, related_name='step_results')
    step_no = models.IntegerField()
    action = models.TextField(blank=True, null=True)
    expected_result = models.TextField(blank=True, null=True)
    actual_result = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50)
    bug_id_ref = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'test_execution_steps'
        ordering = ['step_no']


class Bug(models.Model):
    bug_key = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    execution = models.ForeignKey(TestExecution, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bugs'

    def __str__(self):
        return self.bug_key
