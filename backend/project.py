"""Project-owned settings and literal options for the shared development tools.

Add integration settings here only when this project uses them. Environment
values and secrets belong in the root .env; shared architecture stays generic.
"""
import json
import logging
import os
from pathlib import Path

_logger = logging.getLogger(__name__)
_BASE_DIR = Path(__file__).resolve().parent
DEBUG = os.getenv("DJANGO_DEBUG", "False").lower() == "true"

LANGUAGE_CODE = 'es-mx'
LANGUAGES = [('en', 'English'), ('es', 'Spanish')]

INSTALLED_APPS = [
    'django_filters',
    'django_celery_beat',
    'django_celery_results',
]

# The frontend calls every app under /api/<app>/ (the proxy sends /api to
# Django). The dashboard summary lives in reports and is served at /api/dashboard/.
CUSTOM_URL_PREFIXES = {
    app: f'api/{app}' for app in (
        'agreements', 'appointments', 'authentication', 'budgets', 'clinical',
        'finances', 'installments', 'notifications', 'online_payments',
        'patients', 'treatments',
    )
}
CUSTOM_URL_PREFIXES['reports'] = 'api'

# The authentication app issues its own PyJWT tokens, which simplejwt would
# reject, so the API keeps session authentication only.
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FormParser',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}

# Redis accelerates sessions; the database keeps them durable.
SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'

# Celery (app in notifications/celery.py) ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿
CELERY_BROKER_URL = os.getenv('REDIS_URL') or 'redis://{}:{}/{}'.format(
    os.getenv('REDIS_HOST', 'redis'), os.getenv('REDIS_PORT', '6379'), os.getenv('REDIS_DB', '0'))
CELERY_RESULT_BACKEND = 'django-db'
CELERY_CACHE_BACKEND = 'default'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
CELERY_ENABLE_UTC = True
CELERY_RESULT_EXTENDED = True
CELERY_RESULT_EXPIRES = 3600
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60
CELERY_TASK_SOFT_TIME_LIMIT = 25 * 60
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
CELERY_BEAT_SCHEDULE = {
    'send-appointment-reminders': {
        'task': 'notifications.tasks.send_appointment_reminders',
        'schedule': 3600.0,
    },
    'send-payment-reminders': {
        'task': 'notifications.tasks.send_payment_reminders',
        'schedule': 86400.0,
    },
    'send-installment-reminders': {
        'task': 'notifications.tasks.send_installment_reminders',
        'schedule': 86400.0,
    },
}

# Integrations ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '')
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '')
TWILIO_WHATSAPP_NUMBER = os.getenv('TWILIO_WHATSAPP_NUMBER', '')
STRIPE_PUBLIC_KEY = os.getenv('STRIPE_PUBLIC_KEY', '')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', '')
ZOOM_API_KEY = os.getenv('ZOOM_API_KEY', '')
ZOOM_API_SECRET = os.getenv('ZOOM_API_SECRET', '')
TWILIO_VIDEO_API_KEY = os.getenv('TWILIO_VIDEO_API_KEY', '')
TWILIO_VIDEO_API_SECRET = os.getenv('TWILIO_VIDEO_API_SECRET', '')

# GCS (production media storage) ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿
# Only active in production when GCS_BUCKET_NAME and GCS_PROJECT_ID are set.
if not DEBUG:
    _bucket = os.getenv('GCS_BUCKET_NAME')
    _project_id = os.getenv('GCS_PROJECT_ID')
    _credentials = None
    _credentials_json = os.getenv('GOOGLE_APPLICATION_CREDENTIALS_JSON')
    if _credentials_json:
        try:
            _parsed = json.loads(_credentials_json)
            _required = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email']
            if isinstance(_parsed, dict) and all(k in _parsed for k in _required):
                _credentials = _parsed
            else:
                _logger.warning("GOOGLE_APPLICATION_CREDENTIALS_JSON missing required fields")
        except ValueError:
            _logger.warning("GOOGLE_APPLICATION_CREDENTIALS_JSON is not valid JSON")
    if _bucket and _project_id:
        INSTALLED_APPS.append('storages')
        STORAGES = {
            "default": {
                "BACKEND": "storages.backends.gcloud.GoogleCloudStorage",
                "OPTIONS": {
                    "bucket_name": _bucket,
                    "project_id": _project_id,
                    "credentials": _credentials,
                    "default_acl": None,
                    "querystring_auth": True,
                    "expiration": 3600,
                    "file_overwrite": False,
                    "location": "media",
                },
            },
            "staticfiles": {
                "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
            },
        }
        MEDIA_URL = f"https://storage.googleapis.com/{_bucket}/media/"
        MEDIA_ROOT = str(_BASE_DIR / 'media')

# Sync and launcher options (keep literal) ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿
SYNC_PROJECT_PATHS = []
SYNC_TEMPLATE_REPO = "Ezodis/Django-Next.js"
MOBILE_APP_ORDER = []
MOBILE_ANDROID_METADATA = {}
ENV_DEFAULTS = {
    'PROJECT_ACCOUNT_EMAIL': '',
    'DEFAULT_FROM_EMAIL': '',
    'EMAIL_BACKEND': '',
    'MAILBOX_DOMAIN': '',
    'CLOUDFLARE_ACCOUNT_ID': '',
    'CLOUDFLARE_EMAIL_API_TOKEN': '',
    'BREVO_API_KEY': '',
    'EMAIL_USE_SSL': '',
    'SENDGRID_API_KEY': '',
    'TWILIO_ACCOUNT_SID': '',
    'TWILIO_AUTH_TOKEN': '',
    'TWILIO_PHONE_NUMBER': '',
    'TWILIO_WHATSAPP_NUMBER': '',
    'STRIPE_PUBLIC_KEY': '',
    'STRIPE_SECRET_KEY': '',
    'STRIPE_WEBHOOK_SECRET': '',
    'GCS_BUCKET_NAME': '',
    'GCS_PROJECT_ID': '',
}
COMPOSE_SERVICES = """
services:
  celery-worker:
    image: ${COMPOSE_PROJECT_NAME}_backend:latest
    env_file:
      - .env
    entrypoint: []
    command: celery -A notifications.celery worker -l info
    working_dir: /backend
    environment:
      DJANGO_DEBUG: "${DJANGO_DEBUG:-true}"
      DB_HOST: "db"
      DB_PORT: "5432"
      DB_NAME: "${DB_NAME:-postgres}"
      DB_USER: "${DB_USER:-postgres}"
      DB_PASSWORD: "${DB_PASSWORD:-postgres}"
      REDIS_HOST: "redis"
    volumes:
      - ./backend:/backend:delegated
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
  celery-beat:
    image: ${COMPOSE_PROJECT_NAME}_backend:latest
    env_file:
      - .env
    entrypoint: []
    command: celery -A notifications.celery beat -l info
    working_dir: /backend
    environment:
      DJANGO_DEBUG: "${DJANGO_DEBUG:-true}"
      DB_HOST: "db"
      DB_PORT: "5432"
      DB_NAME: "${DB_NAME:-postgres}"
      DB_USER: "${DB_USER:-postgres}"
      DB_PASSWORD: "${DB_PASSWORD:-postgres}"
      REDIS_HOST: "redis"
    volumes:
      - ./backend:/backend:delegated
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
  mail-worker:
    image: ${COMPOSE_PROJECT_NAME}_backend:latest
    env_file:
      - .env
    entrypoint: []
    command: python manage.py process_mail --loop
    working_dir: /backend
    environment:
      DJANGO_DEBUG: "${DJANGO_DEBUG:-true}"
      DB_HOST: "db"
      DB_PORT: "5432"
      DB_NAME: "${DB_NAME:-postgres}"
      DB_USER: "${DB_USER:-postgres}"
      DB_PASSWORD: "${DB_PASSWORD:-postgres}"
      REDIS_HOST: "redis"
    volumes:
      - ./backend:/backend:delegated
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
"""


# Shared mailbox behavior, with identity and credentials owned by this project.
from mailroom.configuration import project_email_settings as _project_email_settings
globals().update(_project_email_settings())
