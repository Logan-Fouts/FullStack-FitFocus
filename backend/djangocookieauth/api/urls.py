from django.urls import path
from . import views

urlpatterns = [
   path("login/", views.login_view, name="api_login"),
   path("logout/", views.logout_view, name="api_logout"), 
   path("session/", views.session_view, name="api_session"), 
   path("whoami/", views.whoami_view, name="api_whoami"),
   path('register/', views.register_view, name='api_register'),
   path('add-calorie-entry/', views.add_calorie_entry, name="api_add_calorie_entry"),
   path('get-calorie-entries/', views.get_calorie_entries, name="api_get_calorie_entries"),
   path('add-exercise/', views.add_exercise, name="api_add_exercise"),
   path('get-exercises/', views.get_exercises, name="api_get_exercises"),
   path('add-routine/', views.add_routine, name="api_add_routine"),
   path('get-routines/', views.get_routines, name="api_get_routines")
]
