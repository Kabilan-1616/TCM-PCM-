from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
import threading

from .models import Project, ProjectMembership
from .serializers import ProjectSerializer, ProjectMemberSerializer
from core.permissions import IsPM
from .sync import sync_project_to_tcm, fetch_issues_from_tcm


class ProjectViewSet(ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()  # ✅ ADD THIS

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Project.objects.all()
        return Project.objects.filter(members__user=user).distinct()

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsPM()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        project = serializer.save(created_by=self.request.user)
        ProjectMembership.objects.create(project=project, user=self.request.user)

        # ✅ Sync in background
        thread = threading.Thread(target=sync_project_to_tcm, args=(project,), daemon=True)
        thread.start()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        data = self.get_serializer(instance).data
        data["tcm_issues"] = fetch_issues_from_tcm(instance.id)
        return Response(data)

    @action(detail=True, methods=["post"], url_path="sync-to-tcm")
    def sync_to_tcm(self, request, pk=None):
        project = self.get_object()
        result = sync_project_to_tcm(project)
        if result:
            return Response({"status": "synced", "tcm": result})
        return Response({"status": "failed"}, status=500)


class ProjectMembershipViewSet(ModelViewSet):
    serializer_class = ProjectMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get("project")
        queryset = ProjectMembership.objects.all()
        if not user.is_superuser:
            queryset = queryset.filter(project__members__user=user)
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset.distinct()

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsPM()]
        return [IsAuthenticated()]