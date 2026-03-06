import json
import os

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.db.models import Max

from testplans.models import TestPlan, Build
from testcases.models import TestCase
from accounts.models import User
from .models import TestExecution, TestExecutionStep, Bug
from .serializers import StepExecutionSerializer, TestExecutionSerializer, TestExecutionReportSerializer


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def save_execution(request, plan_id, build_id):
    """POST /executions/{plan_id}/{build_id}"""
    try:
        testcase_id = int(request.data.get('testcase_id'))
        exec_status = request.data.get('status', 'Not Run')
        notes = request.data.get('notes', '')
        create_issue = request.data.get('create_issue', 'false') == 'true'
        issue_title = request.data.get('issue_title')
        issue_description = request.data.get('issue_description')
        issue_type = request.data.get('issue_type', 'BUG')
        issue_status = request.data.get('issue_status', 'OPEN')
        issue_severity = request.data.get('issue_severity', 'Medium')
        issue_priority = request.data.get('issue_priority', 'Medium')
        issue_task_id = request.data.get('issue_task_id')
        issue_testcase_id = request.data.get('issue_testcase_id')
        created_by_id = request.data.get('created_by_id')
        steps_raw = request.data.get('steps', '[]')

        try:
            steps_data = json.loads(steps_raw)
        except Exception:
            return Response({'detail': 'Invalid steps JSON'}, status=400)

        execution = TestExecution.objects.create(
            testplan_id=plan_id,
            testcase_id=testcase_id,
            build_id=build_id,
            status=exec_status,
            notes=notes,
            executed_by_id=created_by_id if created_by_id else None,
        )

        # Handle file attachment
        attachment = request.FILES.get('attachment')
        if attachment:
            upload_dir = os.path.join(settings.MEDIA_ROOT)
            os.makedirs(upload_dir, exist_ok=True)
            path = os.path.join(upload_dir, f"exec_{execution.id}_{attachment.name}")
            with open(path, 'wb') as f:
                for chunk in attachment.chunks():
                    f.write(chunk)
            execution.attachment_path = path
            execution.save()

        # Create execution steps
        for step in steps_data:
            TestExecutionStep.objects.create(
                execution=execution,
                step_no=step.get('step_no', 0),
                action=step.get('action', ''),
                expected_result=step.get('expected_result', ''),
                actual_result=step.get('actual_result', ''),
                status=step.get('status', 'Not Run'),
                bug_id_ref=step.get('bug_id_ref'),
            )
            bug_ref = step.get('bug_id_ref')
            if bug_ref and not Bug.objects.filter(bug_key=bug_ref).exists():
                Bug.objects.create(
                    bug_key=bug_ref,
                    description=issue_description or notes,
                    execution=execution,
                )

        # Create Issue if fail and requested
        if exec_status == 'Fail' and create_issue:
            try:
                plan = TestPlan.objects.get(pk=plan_id)
                from issues.models import Issue
                Issue.objects.create(
                    testcase_id=int(issue_testcase_id) if issue_testcase_id else testcase_id,
                    task_id=issue_task_id,
                    title=issue_title or f"Execution Failure: TC-{testcase_id}",
                    description=issue_description or notes,
                    issue_type=issue_type,
                    status=issue_status,
                    severity=issue_severity,
                    priority=issue_priority,
                    created_by_id=int(created_by_id) if created_by_id else None,
                    project=plan.project,
                    linked_execution=execution,
                )
            except Exception as e:
                pass  # Don't fail if issue creation fails

        return Response({'message': 'Saved', 'id': execution.id})

    except Exception as e:
        return Response({'detail': str(e)}, status=400)


@api_view(['GET'])
def get_execution_steps(request, execution_id):
    steps = TestExecutionStep.objects.filter(execution_id=execution_id)
    return Response(StepExecutionSerializer(steps, many=True).data)


@api_view(['GET'])
def get_execution_summary(request, plan_id, build_id):
    executions = TestExecution.objects.filter(testplan_id=plan_id, build_id=build_id)
    total = executions.count()
    return Response({
        'total': total,
        'pass': executions.filter(status='Pass').count(),
        'fail': executions.filter(status='Fail').count(),
        'blocked': executions.filter(status='Blocked').count(),
        'not_run': executions.filter(status='Not Run').count(),
    })


@api_view(['GET'])
def get_execution_report(request):
    plan_id = request.query_params.get('plan_id')
    build_id = request.query_params.get('build_id')

    if not plan_id:
        return Response({'detail': 'plan_id required'}, status=400)

    # select_related for forward ForeignKeys only (testcase, build)
    # Bug has a reverse relationship, so it's not included here
    qs = TestExecution.objects.filter(testplan_id=plan_id).select_related('testcase', 'build')
    if build_id:
        qs = qs.filter(build_id=build_id)
    qs = qs.order_by('-executed_at')
    return Response(TestExecutionReportSerializer(qs, many=True).data)


@api_view(['GET'])
def get_plan_history_report(request, plan_id):
    try:
        plan = TestPlan.objects.select_related('project').get(pk=plan_id)
    except TestPlan.DoesNotExist:
        return Response({'detail': 'Plan not found'}, status=404)

    builds = Build.objects.filter(testplan=plan).order_by('id')  # oldest first = B1, B2...
    history_data = {
        'plan_name': plan.testplan_name,
        'project_name': plan.project.project_name,
        'builds': [],
    }

    for build in builds:
        executions = TestExecution.objects.filter(build=build).select_related(
            'executed_by', 'testcase', 'testcase__suite'
        )
        exec_ids = list(executions.values_list('id', flat=True))

        from issues.models import Issue
        related_issues = Issue.objects.filter(
            linked_execution_id__in=exec_ids
        ).select_related('created_by') if exec_ids else Issue.objects.none()

        build_issues_data = [{
            'id': i.id,
            'title': i.title,
            'severity': i.severity,
            'status': i.status,
            'description': i.description,
            'priority': i.priority,
            'testcase_id': i.testcase_id,   # ← needed to match issues to TCs
            'task_id': i.task_id,
        } for i in related_issues]

        execution_data = []
        for exc in executions:
            steps = TestExecutionStep.objects.filter(execution=exc).order_by('step_no')
            tc = exc.testcase

            execution_data.append({
                'testcase_name':    tc.testcase_name if tc else 'Unknown TC',
                'testcase_id':      exc.testcase_id,
                'task_id':          tc.task_id if tc else 'N/A',            # ← was missing
                'suite_name':       tc.suite.suite_name if tc and tc.suite else 'N/A',  # ← was missing
                'testcase_type':    tc.testcase_type if tc else '',          # ← was missing
                'testcase_status':  tc.testcase_status if tc else '',        # ← was missing
                'created_by':       exc.executed_by.name if exc.executed_by else 'N/A',
                'created_at':       exc.executed_at.strftime('%Y-%m-%d') if exc.executed_at else 'N/A',
                'status':           exc.status,
                'executed_by':      exc.executed_by.name if exc.executed_by else 'Unknown',
                'executed_at':      exc.executed_at.strftime('%Y-%m-%d') if exc.executed_at else '',
                'notes':            exc.notes,
                'steps': [{
                    'step_no':        s.step_no,
                    'description':    s.action,
                    'action':         s.action,
                    'expected':       s.expected_result,
                    'expected_result': s.expected_result,
                    'actual':         s.actual_result,
                    'actual_result':  s.actual_result,
                    'status':         s.status,
                } for s in steps],
            })

        history_data['builds'].append({
            'build_id':       build.id,
            'build_name':     build.build_version,
            'build_version':  build.build_version,
            'is_open':        build.build_open,
            'release_date':   build.build_releaseDate.strftime('%Y-%m-%d') if build.build_releaseDate else 'N/A',
            'issues':         build_issues_data,
            'executions':     execution_data,
        })

    return Response(history_data)


@api_view(['GET'])
def get_next_bug_id(request):
    max_id = Bug.objects.aggregate(max_id=Max('id'))['max_id'] or 0
    return Response({'next_id': f'BUG_{max_id + 1}'})
