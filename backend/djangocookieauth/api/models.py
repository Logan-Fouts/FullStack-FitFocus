# Create your models here.

from django.db import models
from django.contrib.auth.models import User

class CalorieEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    calories = models.PositiveIntegerField()

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.calories} cal on {self.date}"

class Exercise(models.Model):
    EXERCISE_TYPE_CHOICES = [
        (1, 'Strength'),
        (2, 'Cardio'),
        (3, 'Flexibility'),
        (4, 'Balance'),
        (5, 'Rehab'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=100)
    public = models.BooleanField(default=False)
    description = models.CharField(max_length=255)
    url = models.URLField(blank=True, null=True)
    muscle_group = models.CharField(max_length=100)
    exercise_type = models.PositiveIntegerField(choices=EXERCISE_TYPE_CHOICES)
    equipment = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_exercise_type_display()})"