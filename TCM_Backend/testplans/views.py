from rest_framework.decorators import api_view
from rest_framework.response import Response

from testcases.models import TestCase
from testcases.serializers import TestCaseSerializer, TestCaseLightSerializer
from .models import TestPlan, Build
from .serializers import TestPlanSerializer, BuildSerializer


# ── Test Plans ────────────────────────────────────────────────────────────────

@api_view(['GET'])
def plans_by_project(request, project_id):
    plans = TestPlan.objects.filter(project_id=project_id)
    return Response(TestPlanSerializer(plans, many=True).data)


@api_view(['GET'])
def all_test_plans(request):
    return Response(TestPlanSerializer(TestPlan.objects.all(), many=True).data)


@api_view(['POST'])
def create_test_plan(request):
    serializer = TestPlanSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
def test_plan_detail(request, plan_id):
    try:
        plan = TestPlan.objects.get(pk=plan_id)
    except TestPlan.DoesNotExist:
        return Response({'detail': 'Plan not found'}, status=404)

    if request.method == 'GET':
        return Response(TestPlanSerializer(plan).data)
    elif request.method == 'PUT':
        serializer = TestPlanSerializer(plan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        plan.delete()
        return Response(status=204)


def _get_testcases_for_plan(plan_id):
    from django.db import connection
    
    # First check what's in the junction table
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM testplan_testcase WHERE testplan_id = %s", [plan_id])
        rows = cursor.fetchall()
        print(f"[DEBUG] testplan_testcase rows for plan {plan_id}: {rows}")
        
        # Get column names
        cols = [desc[0] for desc in cursor.description] if cursor.description else []
        print(f"[DEBUG] testplan_testcase columns: {cols}")

    try:
        plan = TestPlan.objects.get(pk=plan_id)
        tcs = plan.testcases.prefetch_related('steps').all()
        print(f"[DEBUG] ORM returned {tcs.count()} testcases")
        return tcs
    except TestPlan.DoesNotExist:
        return TestCase.objects.none()

def _assign_testcases(plan_id, testcase_ids):
    try:
        plan = TestPlan.objects.get(pk=plan_id)
    except TestPlan.DoesNotExist:
        print(f"[ERROR] Plan {plan_id} not found")
        return None
    cases = TestCase.objects.filter(id__in=testcase_ids)
    print(f"[DEBUG] Assigning {cases.count()} testcases to plan {plan_id}: {testcase_ids}")
    plan.testcases.set(cases)
    print(f"[DEBUG] After set, plan has {plan.testcases.count()} testcases")
    return plan


@api_view(['GET', 'POST'])
def testplan_testcases(request, plan_id):
    if request.method == 'GET':
        tcs = _get_testcases_for_plan(plan_id)
        count = tcs.count()
        print(f"[DEBUG] GET testcases for plan {plan_id}: {count} found")
        if count == 0:
            print(f"[WARNING] Plan {plan_id} has NO testcases assigned")
        return Response(TestCaseSerializer(tcs, many=True).data)
    elif request.method == 'POST':
        testcase_ids = request.data.get('testcase_ids', [])
        print(f"[DEBUG] POST assign testcases {testcase_ids} to plan {plan_id}")
        plan = _assign_testcases(plan_id, testcase_ids)
        if plan is None:
            return Response({'error': 'Test Plan not found'}, status=404)
        # Return the assigned testcases, not just a message
        tcs = plan.testcases.prefetch_related('steps').all()
        print(f"[DEBUG] POST assignment successful - plan now has {tcs.count()} testcases")
        return Response(TestCaseSerializer(tcs, many=True).data, status=201)


@api_view(['GET'])
def get_testcases_for_execution(request, plan_id):
    tcs = _get_testcases_for_plan(plan_id)
    return Response(TestCaseLightSerializer(tcs, many=True).data)


# ── Builds ────────────────────────────────────────────────────────────────────

@api_view(['POST'])
def create_build(request):
    serializer = BuildSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def builds_by_plan(request, plan_id):
    builds = Build.objects.filter(testplan_id=plan_id)
    return Response(BuildSerializer(builds, many=True).data)


@api_view(['PUT', 'DELETE'])
def build_detail(request, build_id):
    try:
        build = Build.objects.get(pk=build_id)
    except Build.DoesNotExist:
        return Response({'detail': 'Build not found'}, status=404)

    if request.method == 'PUT':
        serializer = BuildSerializer(build, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        build.delete()
        return Response(status=204)


@api_view(['POST'])
def close_build(request, build_id):
    try:
        build = Build.objects.get(pk=build_id)
    except Build.DoesNotExist:
        return Response({'detail': 'Build not found'}, status=404)
    build.build_open = False
    build.save()
    return Response({'message': 'Build locked', 'status': 'Closed'})