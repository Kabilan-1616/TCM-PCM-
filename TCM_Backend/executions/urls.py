from django.urls import path
from . import views

urlpatterns = [
    path('executions/<int:plan_id>/<int:build_id>', views.save_execution),
    path('executions/<int:execution_id>/steps', views.get_execution_steps),
    path('testplans/<int:plan_id>/builds/<int:build_id>/summary', views.get_execution_summary),
    path('reports/executions', views.get_execution_report),
    path('reports/plan-history/<int:plan_id>', views.get_plan_history_report),
    path('utils/next-bug-id', views.get_next_bug_id),
]
