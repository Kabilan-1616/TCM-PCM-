from django.urls import path
from . import views
from .sync_views import sync_project_from_taiga

urlpatterns = [
    path('projects', views.get_all_projects),
    path('allprojects', views.get_all_projects),
    path('projectcreate', views.project_create),
    path('project/<int:project_id>', views.project_detail),
    path('api/projects/sync/', sync_project_from_taiga),  # ✅ Taiga sync endpoint
]