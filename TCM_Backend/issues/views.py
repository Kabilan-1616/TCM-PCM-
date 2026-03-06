from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from .models import Issue
from .serializers import IssueSerializer
from projects.models import Project


def verify_token(request):
    return request.headers.get("X-Internal-Token") == settings.INTERNAL_SYNC_TOKEN


@api_view(['GET'])
def get_execution_issue(request, execution_id):
    issue = Issue.objects.filter(linked_execution_id=execution_id).first()
    if not issue:
        return Response(None)
    return Response(IssueSerializer(issue).data)


@api_view(['GET'])
def get_issues_by_project(request, project_id):
    issues = Issue.objects.filter(project_id=project_id)
    return Response(IssueSerializer(issues, many=True).data)


@api_view(['GET', 'PUT', 'DELETE'])
def issue_detail(request, issue_id):
    try:
        issue = Issue.objects.get(pk=issue_id)
    except Issue.DoesNotExist:
        return Response({'detail': 'Not found'}, status=404)

    if request.method == 'GET':
        return Response(IssueSerializer(issue).data)

    elif request.method == 'PUT':
        serializer = IssueSerializer(issue, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        issue.delete()
        return Response(status=204)


# ✅ NEW — Called by Taiga to fetch issues
# TCM_Backend/issues/views.py

@api_view(['GET'])
@permission_classes([AllowAny])
def get_issues_by_taiga_project(request, taiga_project_id):
    # taiga_project_id IS the shared project id now — same database
    try:
        project = Project.objects.get(id=taiga_project_id)  # ← changed from taiga_project_id= to id=
    except Project.DoesNotExist:
        return Response([], status=200)

    issues = Issue.objects.filter(project=project)
    return Response(IssueSerializer(issues, many=True).data)