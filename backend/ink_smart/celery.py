# your_project/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ink_smart.settings')

app = Celery('ink_smart')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()  # Auto-discover tasks in all apps