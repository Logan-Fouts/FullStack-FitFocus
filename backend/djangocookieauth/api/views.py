from django.shortcuts import render

# Create your views here.

# Standard library imports
import json
from datetime import datetime

# Django imports
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import F, Q
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

# Local imports
from .models import CalorieEntry, Exercise, Routine

@require_POST
def login_view(request):
    data = json.loads(request.body)
    username, password = data.get("username"), data.get("password")
    
    if username is None or password is None:
        return JsonResponse({"details": "Provide username and password"})

        
    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({"details": "Invalid credentials"}, status=400)

    login(request, user)
    return JsonResponse({"details": "Succesfully logged in"}, status=200)

@require_POST
def register_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if username is None or password is None or email is None:
        return JsonResponse({'detail': 'Please provide username, email, and password.'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'detail': 'Username already exists.'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'detail': 'Email already exists.'}, status=400)

    user = User.objects.create_user(username, email, password)
    user.save()

    return JsonResponse({'detail': 'User created successfully.'}, status=201)

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "You are not logged in"}, status=400)
    logout(request)
    return JsonResponse({"details": "Succesfully logged out"}, status=200)

    
@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"isAuthenticated": True})

def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False})
    return JsonResponse({"username": request.user.username})

@login_required
@require_POST
def add_calorie_entry(request):
    data = json.loads(request.body)
    date = data.get('date')
    calories = data.get('calories')

    if not all([date, calories]):
        return JsonResponse({'detail': 'Please provide date and calories.'}, status=400)

    try:
        entry_date = datetime.strptime(date, '%Y-%m-%d').date()
        calories = int(calories)
    except ValueError:
        return JsonResponse({'detail': 'Invalid date format or calories value.'}, status=400)

    today = datetime.now().date()

    entry, created = CalorieEntry.objects.get_or_create(
        user=request.user,
        date=entry_date,
        defaults={'calories': 0}
    )

    if entry_date == today:
        # If it's today, add the calories
        entry.calories += calories
    elif entry_date > today:
        # If it's a future date, set the calories
        entry.calories = calories
    else:
        # If it's a past date, don't allow modifications
        return JsonResponse({'detail': 'Cannot modify past entries.'}, status=400)

    entry.save()

    return JsonResponse({
        'id': entry.id,
        'date': entry.date.isoformat(),
        'calories': entry.calories
    }, status=201 if created else 200)

@login_required
@require_GET
def get_calorie_entries(request):
    entries = CalorieEntry.objects.filter(user=request.user)
    data = [{
        'id': entry.id,
        'date': entry.date.isoformat(),
        'calories': entry.calories
    } for entry in entries]
    return JsonResponse(data, safe=False, status=200)


@login_required
@require_POST
@csrf_protect
def add_exercise(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        public = data.get('public', False)
        description = data.get('description')
        url = data.get('url')
        muscle_group = data.get('muscle_group')
        exercise_type = data.get('exercise_type')
        equipment = data.get('equipment')
        
        if not all([name, description, muscle_group, exercise_type]):
            return JsonResponse({'detail': 'Please provide name, description, muscle group, and exercise type'}, status=400)

        exercise = Exercise.objects.create(
            user=request.user,
            public=public,
            name=name,
            description=description,
            url=url,
            muscle_group=muscle_group,
            exercise_type=exercise_type,
            equipment=equipment
        )

        return JsonResponse({
            'id': exercise.id,
            'user': exercise.user.username,
            'name': exercise.name,
            'public': exercise.public,
            'description': exercise.description,
            'url': exercise.url,
            'muscle_group': exercise.muscle_group,
            'exercise_type': exercise.get_exercise_type_display(),
            'equipment': exercise.equipment
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'detail': 'Invalid JSON in request body'}, status=400)
    except Exception as e:
        # Log the exception here
        print(f"Unexpected error in add_exercise: {str(e)}")
        return JsonResponse({'detail': 'An unexpected error occurred'}, status=500)

@login_required
@require_GET
def get_exercises(request):
    try:
        entries = Exercise.objects.filter(
            Q(user=request.user) | Q(public=True)
        ).distinct()

        data = [{
            'id': entry.id,
            'name': entry.name,
            'description': entry.description,
            'url': entry.url,
            'muscle_group': entry.muscle_group,
            'exercise_type': entry.get_exercise_type_display(),
            'equipment': entry.equipment,
        } for entry in entries]
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": "An error occurred while fetching exercises"}, status=500)

@login_required
@require_POST
def add_routine(request):
    try:
        data = json.loads(request.body)
        print(data)
        user = request.user
        name = data.get('name')
        days = data.get('days', [])  # Expecting a list of days
        description = data.get('description')
        exercise_ids = data.get('exercises', [])  # Expecting a list of exercise IDs

        if not all([name, days, description, exercise_ids]):
            return JsonResponse({'detail': 'Missing required fields'}, status=400)

        with transaction.atomic():
            # Create the routine
            routine = Routine.objects.create(
                user=user,
                name=name,
                description=description,
                day=', '.join(days)  # Join days into a single string
            )

            # Add exercises to the routine
            exercises = Exercise.objects.filter(id__in=exercise_ids)
            routine.exercises.add(*exercises)
        

        return JsonResponse({
            'id': routine.id,
            'name': routine.name,
            'description': routine.description,
            'days': days,
            'exercises': list(exercises.values_list('id', flat=True))
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'detail': 'Invalid JSON in request body'}, status=400)
    except Exception as e:
        # Log the exception here
        print(f"Unexpected error in add_routine: {str(e)}")
        return JsonResponse({'detail': 'An unexpected error occurred'}, status=500)

@login_required
@require_GET
def get_routines(request):
    try:
        routines = Routine.objects.filter(user=request.user)

        data = [{
            'id': routine.id,
            'name': routine.name,
            'description': routine.description,
            'days': routine.day.split(', '),
            'exercises': list(routine.exercises.values('id', 'name'))
        } for routine in routines]
        
        return JsonResponse(data, safe=False, status=200)
    except Exception as e:
        # Log the exception here
        print(f"Unexpected error in get_routines: {str(e)}")
        return JsonResponse({"error": "An error occurred while fetching routines"}, status=500)