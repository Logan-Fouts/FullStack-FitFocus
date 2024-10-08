# Generated by Django 5.1.1 on 2024-10-07 21:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('public', models.BooleanField(default=False)),
                ('description', models.CharField(max_length=255)),
                ('url', models.URLField(blank=True, null=True)),
                ('muscle_group', models.CharField(max_length=100)),
                ('exercise_type', models.PositiveIntegerField(choices=[(1, 'Strength'), (2, 'Cardio'), (3, 'Flexibility'), (4, 'Balance'), (5, 'Rehab')])),
                ('equipment', models.CharField(blank=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercises', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
