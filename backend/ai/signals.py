from django.db.models.signals import post_save
from django.dispatch import receiver
from posts.models import Post
from .tasks import generate_post_summary
from celery import current_app

@receiver(post_save, sender=Post)
def generate_summary(sender, instance, created, **kwargs):
    if created:
        # Check if any workers are available
        try:
            inspector = current_app.control.inspect()
            active_workers = inspector.active() or {}
            
            if active_workers:  # If there are active workers
                generate_post_summary.delay(post_id=instance.id)
            else:
                print("No Celery workers available. Skipping task generation.")                
        except Exception as e:
            print(f"Error checking worker status: {e}")
        