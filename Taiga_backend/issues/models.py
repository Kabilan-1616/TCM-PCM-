# Taiga_backend/issues/models.py
# ─────────────────────────────────────────────────────────────
# READ-ONLY MIRROR — AL TCMS owns the 'issues' table.
# Taiga uses managed=False so Django never tries to migrate it.
#
# AL TCMS FKs that Taiga cannot resolve (TestCase,
# TestExecution) are replaced with plain IntegerField.
# db_column keeps them pointing at the same physical column.
#
# project and created_by CAN be real FKs because Taiga has
# its own Project and AUTH_USER_MODEL in the same database.
# ─────────────────────────────────────────────────────────────
from django.conf import settings
from django.db import models

from projects.models import Project   # Taiga's own Project — same DB


class Issue(models.Model):
    # ── FK columns that only AL TCMS can resolve ──────────
    # Use IntegerField + db_column so the ORM reads the raw ID
    # without trying to JOIN a model Taiga doesn't have.
    testcase_id = models.IntegerField(
        null=True, blank=True, db_column="testcase_id"
    )
    linked_execution_id = models.IntegerField(
        null=True, blank=True, db_column="linked_execution_id"
    )

    # ── Normal scalar columns ─────────────────────────────
    task_id     = models.CharField(max_length=100, blank=True, null=True)
    title       = models.CharField(max_length=300)
    description = models.TextField(blank=True, null=True)

    # Status stored as VARCHAR by AL TCMS master
    # Values: OPEN | IN_PROGRESS | RESOLVED | CLOSED
    status     = models.CharField(max_length=50, default="OPEN")
    priority   = models.CharField(max_length=50, default="Medium")
    severity   = models.CharField(max_length=50, default="Medium")
    issue_type = models.CharField(max_length=50, default="BUG")

    created_at = models.DateTimeField(auto_now_add=True)

    # ── FKs Taiga CAN resolve (same shared DB) ────────────
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="created_by_id",
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="issues",
        null=True,
        blank=True,
    )

    class Meta:
        managed  = False      # AL TCMS owns the migrations
        db_table = "issues"   # Must match AL TCMS master exactly

    def __str__(self):
        return self.title