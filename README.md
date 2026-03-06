# AL TCMS + Taiga — Unified Full-Stack Application

A unified project management and test case management system built with **Django REST Framework** and **React (Vite)**. Both applications share a single **PostgreSQL** database.

---

## 📁 Repository Structure

```
root/
├── TCM_Backend/        → AL TCMS Django backend (API on port 8001)
├── TCM_Frontend/       → AL TCMS React frontend (Vite on port 5173)
├── Taiga_backend/      → Taiga Django backend (API on port 8000)
└── Taiga_frontend/     → Taiga React frontend (Vite on port 5174)
```

---

## 🗄️ Shared Database Architecture

Both backends connect to the **same PostgreSQL database**.

| Table      | Owner (runs migrations) | Mirror (managed=False)  |
|------------|------------------------|-------------------------|
| `projects` | Taiga backend          | AL TCMS backend         |
| `issues`   | AL TCMS backend        | Taiga backend           |

---

## ⚙️ Prerequisites

Make sure you have these installed before starting:

| Tool          | Version     | Download |
|---------------|-------------|----------|
| Python        | 3.10+       | https://www.python.org/downloads/ |
| Node.js       | 18+         | https://nodejs.org/ |
| PostgreSQL    | 14, 15 or 16 | https://www.postgresql.org/download/windows/ |
| Git           | Latest      | https://git-scm.com/ |

---

## 🐘 Step 1 — PostgreSQL Setup (Windows)

### 1.1 Install PostgreSQL

1. Download from https://www.postgresql.org/download/windows/
2. Run the installer — keep all defaults
3. Set a password for the `postgres` user — **remember this password**
4. Keep port as **5432**

### 1.2 Add psql to PATH

1. Press **Windows key** → search **Environment Variables**
2. Click **Edit the system environment variables**
3. Click **Environment Variables** button
4. Under **System variables** → find **Path** → click **Edit**
5. Click **New** and paste:
   ```
   C:\Program Files\PostgreSQL\15\bin
   ```
   > Replace `15` with your installed version number
6. Click **OK** on all windows
7. **Close and reopen** CMD

### 1.3 Create the shared database

Open **CMD as Administrator** and run:

```cmd
psql -U postgres -h localhost
```

Type your postgres password. Then run these SQL commands one by one:

```sql
CREATE USER shared_user WITH PASSWORD 'yourpassword123';
CREATE DATABASE shared_tcms_db OWNER shared_user;
GRANT ALL PRIVILEGES ON DATABASE shared_tcms_db TO shared_user;
\q
```

### 1.4 Verify the connection

```cmd
psql -U shared_user -d shared_tcms_db -h localhost
```

Type password `yourpassword123`. You should see:
```
shared_tcms_db=>
```
Type `\q` to exit.

---

## 📥 Step 2 — Clone the Repository

```cmd
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

---

## 🔧 Step 3 — Taiga Backend Setup

### 3.1 Create virtual environment and install dependencies

```cmd
cd Taiga_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

> If there is no `requirements.txt`, install manually:
> ```cmd
> pip install django djangorestframework psycopg2-binary django-cors-headers python-dotenv djangorestframework-simplejwt
> ```

### 3.2 Create the `.env` file

Create a file called `.env` inside `Taiga_backend/` and paste:

```env
SECRET_KEY=your-secret-key-taiga-change-this-to-random-string
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=shared_tcms_db
DB_USER=shared_user
DB_PASSWORD=yourpassword123
DB_HOST=localhost
DB_PORT=5432

CORS_ORIGIN=http://localhost:5174
```

### 3.3 Run migrations (Taiga goes FIRST — it owns the projects table)

```cmd
python manage.py makemigrations
python manage.py migrate
```

### 3.4 Create a superuser

```cmd
python manage.py createsuperuser
```

### 3.5 Start the server

```cmd
python manage.py runserver 8000
```

---

## 🔧 Step 4 — AL TCMS Backend Setup

Open a **new CMD window**:

### 4.1 Create virtual environment and install dependencies

```cmd
cd TCM_Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

> If there is no `requirements.txt`, install manually:
> ```cmd
> pip install django djangorestframework psycopg2-binary django-cors-headers python-dotenv djangorestframework-simplejwt
> ```

### 4.2 Create the `.env` file

Create a file called `.env` inside `TCM_Backend/` and paste:

```env
SECRET_KEY=your-secret-key-altcms-change-this-to-random-string
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=shared_tcms_db
DB_USER=shared_user
DB_PASSWORD=yourpassword123
DB_HOST=localhost
DB_PORT=5432

CORS_ORIGIN=http://localhost:5173

INTERNAL_SYNC_TOKEN=supersecrettoken123
```

### 4.3 Run migrations (AL TCMS goes SECOND — it owns the issues table)

```cmd
python manage.py migrate projects --fake-initial
python manage.py makemigrations
python manage.py migrate
```

### 4.4 Create a superuser

```cmd
python manage.py createsuperuser
```

### 4.5 Start the server

```cmd
python manage.py runserver 8001
```

---

## 🌐 Step 5 — Taiga Frontend Setup

Open a **new CMD window**:

```cmd
cd Taiga_frontend
npm install
npm run dev
```

App runs at: **http://localhost:5174**

---

## 🌐 Step 6 — AL TCMS Frontend Setup

Open a **new CMD window**:

```cmd
cd TCM_Frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

## 🚀 Running All Four Services

You need **4 separate CMD windows** open at the same time:

| Window | Command | URL |
|--------|---------|-----|
| 1 — Taiga Backend | `cd Taiga_backend && venv\Scripts\activate && python manage.py runserver 8000` | http://127.0.0.1:8000 |
| 2 — TCM Backend | `cd TCM_Backend && venv\Scripts\activate && python manage.py runserver 8001` | http://127.0.0.1:8001 |
| 3 — Taiga Frontend | `cd Taiga_frontend && npm run dev` | http://localhost:5174 |
| 4 — TCM Frontend | `cd TCM_Frontend && npm run dev` | http://localhost:5173 |

---

## 🗂️ Database Tables Overview

After setup, your PostgreSQL database will contain these key tables:

| Table | Owner |
|-------|-------|
| `projects` | Taiga backend |
| `issues` | AL TCMS backend |
| `suites` | AL TCMS backend |
| `testcases` | AL TCMS backend |
| `testcase_steps` | AL TCMS backend |
| `testplans` | AL TCMS backend |
| `users_user` | Taiga backend |
| `tasks_task` | Taiga backend |
| `userstories_userstory` | Taiga backend |
| `sprints_sprint` | Taiga backend |

---

## 🔐 Environment Variables Reference

### Taiga Backend (`Taiga_backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | Any long random string |
| `DEBUG` | Debug mode | `True` for development |
| `DB_NAME` | Database name | `shared_tcms_db` |
| `DB_USER` | Database user | `shared_user` |
| `DB_PASSWORD` | Database password | `yourpassword123` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5174` |

### AL TCMS Backend (`TCM_Backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | Any long random string |
| `DEBUG` | Debug mode | `True` for development |
| `DB_NAME` | Database name | `shared_tcms_db` |
| `DB_USER` | Database user | `shared_user` |
| `DB_PASSWORD` | Database password | `yourpassword123` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |
| `INTERNAL_SYNC_TOKEN` | Internal API token | Any secret string |

---

## 🛠️ Common Errors and Fixes

### `psql is not recognized`
Add PostgreSQL bin folder to PATH (see Step 1.2).

### `InconsistentMigrationHistory`
```cmd
psql -U shared_user -d shared_tcms_db -h localhost
```
```sql
DELETE FROM django_migrations WHERE app = 'issues';
DELETE FROM django_migrations WHERE app = 'accounts';
\q
```
Then re-run migrations in order (Taiga first, TCM second).

### `relation "suites" does not exist`
```cmd
cd TCM_Backend
venv\Scripts\activate
python manage.py migrate
```

### `401 Unauthorized` on API calls
Make sure you are logged in on the frontend. The JWT token must exist in `localStorage` under the key `access`.

### `Cannot resolve keyword 'taiga_project_id'`
This field was removed in the shared DB migration. Make sure your `TCM_Backend/issues/views.py` uses `Project.objects.get(id=taiga_project_id)` not `Project.objects.get(taiga_project_id=taiga_project_id)`.

---

## 📌 .gitignore Recommendations

Make sure your `.gitignore` includes:

```gitignore
# Python
venv/
__pycache__/
*.pyc
*.pyo
.env

# Node
node_modules/
dist/
.env.local

# Database
*.sqlite3

# OS
.DS_Store
Thumbs.db
```

---

## 📄 License

MIT License — feel free to use and modify.