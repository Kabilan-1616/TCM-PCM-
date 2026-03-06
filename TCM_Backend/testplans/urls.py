from django.urls import path
from . import views

urlpatterns = [
    # Test Plans
    path('projects/<int:project_id>/testplans', views.plans_by_project),
    path('alltestplans', views.all_test_plans),
    path('createtestplan', views.create_test_plan),
    path('testplan/<int:plan_id>', views.test_plan_detail),
    path('testplans/<int:plan_id>/testcases', views.testplan_testcases),
    path('testplans/<int:plan_id>/testcases-with-steps', views.get_testcases_for_execution),

    # Builds
    path('createbuild', views.create_build),
    path('testplans/<int:plan_id>/builds', views.builds_by_plan),
    path('build/<int:build_id>', views.build_detail),
    path('builds/<int:build_id>/close', views.close_build),
]
