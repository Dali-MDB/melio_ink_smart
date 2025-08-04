from rest_framework.decorators import api_view,permission_classes
from .utils import TagsAi,SummaryAi
from rest_framework.response import Response
from posts.models import Post
from django.shortcuts import get_object_or_404


@api_view(['GET'])
def get_tags_for_post(request):
    post_id = request.GET.get('post_id')
    post = get_object_or_404(Post,id=post_id)
    ai = TagsAi(post)
    rslt = ai.get_tags()
    return Response(rslt)


@api_view(['GET'])
def get_summary_for_post(request):
    post_id = request.GET.get('post_id')
    post = get_object_or_404(Post,id=post_id)
    ai = SummaryAi(post)
    rslt = ai.get_summary()
    return Response(rslt)