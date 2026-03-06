# Taiga_backend/projects/models.py
# ─────────────────────────────────────────────────────────────
# MASTER — Taiga owns the 'projects' table and all its
# migrations.  db_table is now explicit so AL TCMS's mirror
# can reference the same name without guessing the default
# Django app-label prefix.
# ─────────────────────────────────────────────────────────────
from django.conf import settings
from django.db import models


class Project(models.Model):
    name        = models.CharField(max_length=200)
    slug        = models.SlugField(unique=True, db_index=True)
    description = models.TextField(blank=True)
    is_private  = models.BooleanField(default=False)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_projects",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    # ── TCM feature flags (used by AL TCMS, stored here) ──
    prefix                  = models.CharField(max_length=20, blank=True, default="")
    enable_requirements     = models.BooleanField(default=False)
    enable_testing_priority = models.BooleanField(default=False)
    enable_test_automation  = models.BooleanField(default=False)
    enable_inventory        = models.BooleanField(default=False)
    project_active          = models.BooleanField(default=True)

    class Meta:
        managed  = True        # Taiga owns the migrations
        db_table = "projects"  # Explicit — must match AL TCMS mirror

    def __str__(self):
        return self.name


class ProjectMembership(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="members",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="project_memberships",
    )

    class Meta:
        unique_together = ("project", "user")