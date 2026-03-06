from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from .models import Project
import re


def verify_token(request):
    return request.headers.get("X-Internal-Token") == settings.INTERNAL_SYNC_TOKEN


def generate_prefix(name, project_id):
    words = re.findall(r'\w+', name.upper())
    prefix = ''.join(w[0] for w in words)[:5]
    if not prefix:
        prefix = "PRJ"
    return f"{prefix}{project_id}"


@api_view(["POST"])
@permission_classes([AllowAny])
def sync_project_from_taiga(request):
    if not verify_token(request):
        return Response({"error": "Unauthorized"}, status=401)

    taiga_id = request.data.get("taiga_project_id")
    name = request.data.get("name")
    description = request.data.get("description", "")

    if not taiga_id or not name:
        return Response({"error": "taiga_project_id and name are required"}, status=400)

    # ✅ Use sent prefix or auto-generate
    prefix = request.data.get("prefix") or generate_prefix(name, taiga_id)

    project, created = Project.objects.update_or_create(
        taiga_project_id=taiga_id,
        defaults={
            "project_name": name,
            "project_description": description,
            "prefix": prefix,
            # ✅ Sync all settings
            "enable_requirements": request.data.get("enable_requirements", False),
            "enable_testing_priority": request.data.get("enable_testing_priority", False),
            "enable_test_automation": request.data.get("enable_test_automation", False),
            "enable_inventory": request.data.get("enable_inventory", False),
            "project_active": request.data.get("project_active", True),
        },
    )

    return Response({
        "id": project.id,
        "taiga_project_id": project.taiga_project_id,
        "project_name": project.project_name,
        "prefix": project.prefix,
        "created": created,
    }, status=201 if created else 200)