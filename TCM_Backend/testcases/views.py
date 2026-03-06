from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from projects.models import Project
from .models import Suite, TestCase, TestCaseStep, Keyword
from .serializers import (
    SuiteSerializer, TestCaseSerializer, TestCaseLightSerializer,
    SuiteWithTestcasesSerializer, KeywordSerializer
)


# ── Suites ──────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def suites_by_project(request, project_id):
    """GET /projects/{id}/suites  |  POST /projects/{id}/suites"""
    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        return Response({'detail': 'Project not found'}, status=404)

    if request.method == 'GET':
        suites = Suite.objects.filter(project=project)
        return Response(SuiteSerializer(suites, many=True).data)

    elif request.method == 'POST':
        data = request.data.copy()
        data['project_id'] = project_id
        serializer = SuiteSerializer(data=data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['POST'])
def create_suite_legacy(request):
    """POST /createtestsuite"""
    project_id = request.data.get('project_id')
    try:
        project = Project.objects.get(pk=project_id)
    except Project.DoesNotExist:
        return Response({'detail': 'Project not found'}, status=404)

    serializer = SuiteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(project=project)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def get_testsuites_by_project(request, project_id):
    """GET /testsuites/{project_id}  (legacy alias)"""
    suites = Suite.objects.filter(project_id=project_id)
    return Response(SuiteSerializer(suites, many=True).data)


@api_view(['GET', 'PUT', 'DELETE'])
def suite_detail(request, suite_id):
    try:
        suite = Suite.objects.get(pk=suite_id)
    except Suite.DoesNotExist:
        return Response({'detail': 'Suite not found'}, status=404)

    if request.method == 'GET':
        return Response(SuiteSerializer(suite).data)

    elif request.method == 'PUT':
        serializer = SuiteSerializer(suite, data={
            'suite_name': request.data.get('suite_name', suite.suite_name),
            'suite_description': request.data.get('suite_description', suite.suite_description),
            'project_id': suite.project_id,
        })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        suite.delete()
        return Response({'message': 'Deleted'})


# ── Test Cases ───────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def testcases_by_suite(request, suite_id):
    """GET /suites/{id}/testcases  |  POST /suites/{id}/testcases"""
    try:
        suite = Suite.objects.get(pk=suite_id)
    except Suite.DoesNotExist:
        return Response({'detail': 'Suite not found'}, status=404)

    if request.method == 'GET':
        tcs = TestCase.objects.filter(suite=suite).prefetch_related('steps')
        return Response(TestCaseSerializer(tcs, many=True).data)

    elif request.method == 'POST':
        data = request.data.copy()
        data['suite_id'] = suite_id
        serializer = TestCaseSerializer(data=data)
        if serializer.is_valid():
            tc = serializer.save(suite=suite)
            return Response(TestCaseSerializer(tc).data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
def testcase_detail(request, testcase_id):
    try:
        tc = TestCase.objects.prefetch_related('steps').get(pk=testcase_id)
    except TestCase.DoesNotExist:
        return Response({'detail': 'TC not found'}, status=404)

    if request.method == 'GET':
        return Response(TestCaseSerializer(tc).data)

    elif request.method == 'PUT':
        serializer = TestCaseSerializer(tc, data=request.data)
        if serializer.is_valid():
            updated_tc = serializer.save()
            return Response(TestCaseSerializer(updated_tc).data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        tc.delete()
        return Response(status=204)


@api_view(['GET'])
def testcases_by_project(request, project_id):
    """GET /projects/{id}/testcases - all TCs for RTM report"""
    tcs = TestCase.objects.filter(suite__project_id=project_id).prefetch_related('steps')
    return Response(TestCaseSerializer(tcs, many=True).data)


@api_view(['GET'])
def suites_with_testcases(request, project_id):
    """GET /projects/{id}/suites-with-testcases"""
    suites = Suite.objects.filter(project_id=project_id).prefetch_related('testcases')
    return Response(SuiteWithTestcasesSerializer(suites, many=True).data)


# ── Keywords ─────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
def keywords_list(request):
    if request.method == 'GET':
        return Response(KeywordSerializer(Keyword.objects.all(), many=True).data)
    elif request.method == 'POST':
        name = request.data.get('name', '').strip()
        kw, created = Keyword.objects.get_or_create(name=name)
        return Response(KeywordSerializer(kw).data, status=201 if created else 200)
