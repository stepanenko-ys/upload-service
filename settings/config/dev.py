# === For SQLite3 ===========================================
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DATABASES_ENGINE = 'django.db.backends.sqlite3'
DATABASES_NAME = os.path.join(BASE_DIR, 'db.sqlite3')
# ===========================================================


# === For PostgreSQL ========================================
# DATABASES_ENGINE = 'django.db.backends.postgresql_psycopg2'
# DATABASES_NAME = 'postgres-dev'
# DATABASES_USER = 'user-project_name'
# DATABASES_PASSWORD = 'user_password'
# ===========================================================
