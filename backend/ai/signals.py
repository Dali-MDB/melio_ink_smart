from django.db.models.signals import post_save
from django.dispatch import receiver
from posts.models import Post
from .tasks import generate_post_summary

@receiver(post_save,sender=Post)
def generate_summary(sender, instance, created, **kwargs):
    if created:
        generate_post_summary.delay(post_id = instance.id)