from django.urls import path
from . import views

urlpatterns = [
    # Suites
    path('projects/<int:project_id>/suites', views.suites_by_project),
    path('testsuites/<int:project_id>', views.get_testsuites_by_project),
    path('createtestsuite', views.create_suite_legacy),
    path('suites/<int:suite_id>', views.suite_detail),

    # Test Cases
    path('suites/<int:suite_id>/testcases', views.testcases_by_suite),
    path('testcases/<int:testcase_id>', views.testcase_detail),
    path('projects/<int:project_id>/testcases', views.testcases_by_project),
    path('projects/<int:project_id>/suites-with-testcases', views.suites_with_testcases),

    # Keywords
    path('keywords', views.keywords_list),
]
