# ALTCMS_backend/issues/models.py
# ─────────────────────────────────────────────────────────────
# MASTER — AL TCMS owns this table and all its migrations.
# Status is stored as a VARCHAR so both apps can use it without
# an IntegerField/CharField mismatch.
# Unified status values: OPEN | IN_PROGRESS | RESOLVED | CLOSED
# ─────────────────────────────────────────────────────────────
from django.db import models
from projects.models import Project
from testcases.models import TestCase
from accounts.models import User


class Issue(models.Model):
    STATUS_CHOICES = [
        ("OPEN",        "Open"),
        ("IN_PROGRESS", "In Progress"),
        ("RESOLVED",    "Resolved / Ready for Test"),
        ("CLOSED",      "Closed"),
    ]

    ISSUE_TYPE_CHOICES = [
        ("BUG",         "Bug"),
        ("ENHANCEMENT", "Enhancement"),
        ("TASK",        "Task"),
    ]

    SEVERITY_CHOICES = [
        ("Low",      "Low"),
        ("Medium",   "Medium"),
        ("High",     "High"),
        ("Critical", "Critical"),
    ]

    PRIORITY_CHOICES = [
        ("Low",    "Low"),
        ("Medium", "Medium"),
        ("High",   "High"),
    ]

    # FK to TestCase — only AL TCMS has this model
    testcase = models.ForeignKey(
        TestCase,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    # Soft reference: task ref string from the test case (e.g. "PROJ-42")
    task_id = models.CharField(max_length=100, blank=True, null=True)

    title       = models.CharField(max_length=300)
    description = models.TextField(blank=True, null=True)

    status      = models.CharField(max_length=50, choices=STATUS_CHOICES,      default="OPEN")
    priority    = models.CharField(max_length=50, choices=PRIORITY_CHOICES,    default="Medium")
    severity    = models.CharField(max_length=50, choices=SEVERITY_CHOICES,    default="Medium")
    issue_type  = models.CharField(max_length=50, choices=ISSUE_TYPE_CHOICES,  default="BUG")

    created_at  = models.DateTimeField(auto_now_add=True)
    created_by  = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    # FK to the shared projects table (Taiga-owned, but fully accessible)
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="issues",
        null=True,
        blank=True,
    )

    # FK to TestExecution — only AL TCMS has this model
    linked_execution = models.ForeignKey(
        "executions.TestExecution",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="issues",
    )

    class Meta:
        managed  = True       # AL TCMS owns this table
        db_table = "issues"

    def __str__(self):
        return self.title