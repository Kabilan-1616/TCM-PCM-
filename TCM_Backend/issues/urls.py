from django.urls import path
from . import views

urlpatterns = [
    path('executions/<int:execution_id>/issue', views.get_execution_issue),
    path('projects/<int:project_id>/issues', views.get_issues_by_project),
    path('issues/<int:issue_id>', views.issue_detail),
    path('api/issues/by-taiga-project/<int:taiga_project_id>/', views.get_issues_by_taiga_project),  # ✅ NEW
]