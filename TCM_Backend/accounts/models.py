from django.db import models


class User(models.Model):
    email = models.EmailField(unique=True)
    employee_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=200)
    password = models.CharField(max_length=255)
    is_admin = models.BooleanField(default=False)
    role = models.CharField(max_length=50, default='viewer')
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.name} ({self.email})"
