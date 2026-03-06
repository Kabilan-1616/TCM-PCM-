from django.db import models
from projects.models import Project


class Suite(models.Model):
    suite_name = models.CharField(max_length=200)
    suite_description = models.TextField(blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='suites')

    class Meta:
        db_table = 'suites'

    def __str__(self):
        return self.suite_name


class Keyword(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'keywords'

    def __str__(self):
        return self.name


class TestCase(models.Model):
    suite = models.ForeignKey(Suite, on_delete=models.CASCADE, related_name='testcases')
    task_id = models.CharField(max_length=50, blank=True, null=True)
    testcase_name = models.CharField(max_length=300)
    testcase_summary = models.TextField(blank=True, null=True)
    testcase_precondition = models.TextField(blank=True, null=True)
    testcase_status = models.CharField(max_length=50, default='Draft')
    testcase_importance = models.CharField(max_length=50, default='Medium')
    testcase_executiontype = models.CharField(max_length=50, default='Manual')
    testcase_type = models.CharField(max_length=50, default='Functional')
    keywords = models.ManyToManyField(Keyword, blank=True, related_name='testcases', db_table='testcase_keyword_assoc')

    class Meta:
        db_table = 'testcases'

    def __str__(self):
        return self.testcase_name


class TestCaseStep(models.Model):
    testcase = models.ForeignKey(TestCase, on_delete=models.CASCADE, related_name='steps')
    step_no = models.IntegerField()
    precondition = models.TextField(blank=True, null=True)
    action = models.TextField()
    expected_result = models.TextField()

    class Meta:
        db_table = 'testcase_steps'
        ordering = ['step_no']

    def __str__(self):
        return f"Step {self.step_no} of TC {self.testcase_id}"


# Legacy model
class TestSuiteLegacy(models.Model):
    suite_name = models.CharField(max_length=100)
    suite_detail = models.CharField(max_length=500, blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='testsuites_legacy')

    class Meta:
        db_table = 'testsuites_legacy'
