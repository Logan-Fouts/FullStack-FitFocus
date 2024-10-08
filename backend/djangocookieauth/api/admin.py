from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Exercise

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'muscle_group', 'exercise_type', 'public']
    list_filter = ['muscle_group', 'exercise_type', 'public']
    search_fields = ['name', 'description']