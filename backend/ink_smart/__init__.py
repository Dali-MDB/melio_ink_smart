try:
    from .celery import app as celery_app
    __all__ = ('celery_app',)
except ImportError:
    # Celery is optional for development
    __all__ = ()