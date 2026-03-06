import hashlib
import hmac
import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from .models import User


def hash_password(password: str) -> str:
    import hashlib
    import secrets
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"pbkdf2:{salt}:{hashed.hex()}"


def verify_password(plain: str, stored: str) -> bool:
    # Support legacy bcrypt-style stored passwords from FastAPI
    if stored.startswith('$2b$') or stored.startswith('$2a$'):
        try:
            import bcrypt
            return bcrypt.checkpw(plain.encode(), stored.encode())
        except Exception:
            return False
    # Our own pbkdf2 format
    try:
        _, salt, hashed = stored.split(':')
        check = hashlib.pbkdf2_hmac('sha256', plain.encode(), salt.encode(), 100000)
        return check.hex() == hashed
    except Exception:
        return False


@api_view(['POST'])
def register_user(request):
    data = request.data
    email = data.get('email', '').strip()
    employee_id = data.get('employee_id')
    name = data.get('name', '').strip()
    password = data.get('password', '')

    if not all([email, employee_id, name, password]):
        return Response({'detail': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(Q(email=email) | Q(employee_id=employee_id)).exists():
        return Response({'detail': 'User exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        email=email,
        employee_id=employee_id,
        name=name,
        password=hash_password(password),
        role='viewer',
        is_active=False,
    )
    return Response({'message': 'Registered', 'user_id': user.id}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_user(request):
    identifier = request.data.get('identifier', '')
    password = request.data.get('password', '')

    if identifier.isdigit():
        user = User.objects.filter(employee_id=int(identifier)).first()
    else:
        user = User.objects.filter(email=identifier).first()

    if not user or not verify_password(password, user.password):
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.is_active:
        return Response({'detail': 'Not approved'}, status=status.HTTP_403_FORBIDDEN)

    return Response({
        'message': 'Success',
        'user_id': user.id,
        'user_name': user.name,
        'role': user.role,
    })
