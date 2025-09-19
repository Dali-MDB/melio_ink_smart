from rest_framework.decorators import api_view,permission_classes
from .utils import TagsAi,SummaryAi
from rest_framework.response import Response
from posts.models import Post
from django.shortcuts import get_object_or_404


@api_view(['GET'])
def get_tags_for_post(request):
    """
    Get AI-generated tags for a post
    
    Goal: Use AI to generate relevant tags for a specific post based on its content
    Path: GET /ai/tags/?post_id=<int>
    Authentication: Not required
    
    Request Body: None
    Query Parameters: post_id (required)
    
    Response:
    - 200: {"tags": ["tag1", "tag2", "tag3"]}
    - 404: {"detail": "Not found."}
    """
    post_id = request.GET.get('post_id')
    post = get_object_or_404(Post,id=post_id)
    ai = TagsAi(post)
    rslt = ai.get_tags()
    return Response(rslt)


@api_view(['GET'])
def get_summary_for_post(request):
    """
    Get AI-generated summary for a post
    
    Goal: Use AI to generate a summary of a specific post based on its content
    Path: GET /ai/summary/?post_id=<int>
    Authentication: Not required
    
    Request Body: None
    Query Parameters: post_id (required)
    
    Response:
    - 200: {"summary": "AI-generated summary of the post content..."}
    - 404: {"detail": "Not found."}
    """
    post_id = request.GET.get('post_id')
    post = get_object_or_404(Post,id=post_id)
    ai = SummaryAi(post)
    rslt = ai.get_summary()
    return Response(rslt)