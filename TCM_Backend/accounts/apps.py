from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        try:
            from .models import User
            from .views import hash_password
            if not User.objects.filter(email='admin@testlink.com').exists():
                User.objects.create(
                    email='admin@testlink.com',
                    employee_id=1001,
                    name='Admin',
                    password=hash_password('admin123'),
                    is_admin=True,
                    role='admin',
                    is_active=True,
                )
        except Exception:
            pass  # Tables don't exist yet (before migrate)