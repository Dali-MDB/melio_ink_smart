from celery import shared_task
from posts.models import Post
from .utils import SummaryAi,TagsAi
from django.shortcuts import get_object_or_404

@shared_task()
def generate_post_summary(post_id:int):
    post = get_object_or_404(Post,id=post_id)
    ai = SummaryAi(post)
    summary = ai.get_summary()
    post.summary = summary
    post.save()