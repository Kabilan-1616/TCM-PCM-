#!/bin/bash
set -e

echo "=== TestLink Django Backend Setup ==="

# Copy env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from .env.example — please edit it with your DB credentials"
fi

# Install deps
echo "Installing requirements..."
pip install -r requirements.txt

# Migrations
echo "Running migrations..."
python manage.py makemigrations accounts projects testcases testplans executions issues
python manage.py migrate

echo ""
echo "=== Setup complete! ==="
echo "Run: python manage.py runserver 8000"
echo "Default admin: admin@testlink.com / admin123"
