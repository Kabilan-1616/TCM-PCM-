from django.core.management.base import BaseCommand
from projects.models import Project
from projects.sync import sync_project_to_tcm


class Command(BaseCommand):
    help = "Sync all Taiga projects to TCM"

    def handle(self, *args, **kwargs):
        projects = Project.objects.all()
        self.stdout.write(f"Found {projects.count()} projects to sync...")

        success = 0
        failed = 0

        for project in projects:
            result = sync_project_to_tcm(project)
            if result:
                self.stdout.write(f"  ✅ Synced: {project.name} (id={project.id})")
                success += 1
            else:
                self.stdout.write(f"  ❌ Failed: {project.name} (id={project.id})")
                failed += 1

        self.stdout.write(f"\nDone! {success} synced, {failed} failed.")