from rest_framework.decorators import api_view,permission_classes
from .utils import TagsAi,SummaryAi
from rest_framework.response import Response
from posts.models import Post
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter


@extend_schema(
    tags=['AI'],
    summary='Get AI-generated tags for a post',
    description='Use AI to generate relevant tags for a specific post based on its content.',
    responses={
        200: {
            'type': 'object',
            'properties': {
                'tags': {
                    'type': 'array',
                    'items': {'type': 'string'},
                    'description': 'List of AI-generated tags'
                }
            }
        },
        404: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'Not found.'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.QUERY,
            description='ID of the post to generate tags for',
            required=True,
            type=int
        )
    ]
)
@api_view(['GET'])
def get_tags_for_post(request):
    post_id = request.GET.get('post_id')
    post = get_object_or_404(Post,id=post_id)
    ai = TagsAi(post)
    rslt = ai.get_tags()
    return Response(rslt)


@extend_schema(
    tags=['AI'],
    summary='Get AI-generated summary for a post',
    description='Use AI to generate a summary of a specific post based on its content.',
    responses={
        200: {
            'type': 'object',
            'properties': {
                'summary': {
                    'type': 'string',
                    'description': 'AI-generated summary of the post'
                }
            }
        },
        404: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'Not found.'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.QUERY,
            description='ID of the post to generate summary for',
            required=True,
            type=int
        )
    ]
)
@api_view(['GET'])
def get_summary_for_post(request):
    post_id = request.GET.get('post_id')
    post = get_object_or_404(Post,id=post_id)
    ai = SummaryAi(post)
    rslt = ai.get_summary()
    return Response(rslt)