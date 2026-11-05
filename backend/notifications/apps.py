from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifications'
    verbose_name = 'Notificaciones'

    def ready(self):
        # Load the Celery app so shared_task producers use the Redis broker.
        from . import celery  # noqa: F401
