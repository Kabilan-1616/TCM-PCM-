# ALTCMS_backend/projects/models.py
# ─────────────────────────────────────────────────────────────
# READ-ONLY MIRROR — Taiga owns the 'projects' table and its
# migrations. AL TCMS uses managed=False so Django never tries
# to CREATE, ALTER, or DROP it from this side.
#
# Field aliases (db_column) bridge the naming difference:
#   AL TCMS Python name   ←→   actual DB column (Taiga's name)
#   project_name               name
#   project_description        description
#
# taiga_project_id has been removed: with a shared database the
# two apps share the same row, so a cross-reference ID is moot.
# ─────────────────────────────────────────────────────────────
from django.db import models


class Project(models.Model):
    # Maps to Taiga's 'name' column
    project_name = models.CharField(max_length=200, db_column="name")
    slug = models.SlugField(unique=True)

    # Maps to Taiga's 'description' column
    project_description = models.TextField(blank=True, default="", db_column="description")

    is_private = models.BooleanField(default=False)

    # TCM feature flags — these columns exist in Taiga's master model
    prefix = models.CharField(max_length=20, blank=True, default="")
    enable_requirements = models.BooleanField(default=False)
    enable_testing_priority = models.BooleanField(default=False)
    enable_test_automation = models.BooleanField(default=False)
    enable_inventory = models.BooleanField(default=False)
    project_active = models.BooleanField(default=True)

    class Meta:
        managed = False          # Taiga owns this table's migrations
        db_table = "projects"    # Must match Taiga's db_table exactly

    def __str__(self):
        return self.project_name