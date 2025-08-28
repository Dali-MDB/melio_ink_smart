from rest_framework.decorators import api_view,permission_classes
from django.shortcuts import get_object_or_404
from .models import Like,Post
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.serializers import ProfileSerializer
from users.models import User,Profile
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework import status

@extend_schema(
    tags=['Likes'],
    summary='Like or unlike a post',
    description='Toggle like status for a specific post. If the post is not liked, it will be liked. If already liked, it will be unliked.',
    request=None,
    responses={
        200: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'you have unliked this post'}
            }
        },
        201: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'you have liked this post'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the post to like/unlike',
            required=True,
            type=int
        )
    ]
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request,post_id):
    like = Like.objects.filter(post_id=post_id,user_id = request.user.id).first()
    if not like:   #we create a like
        like = Like.objects.create(post_id=post_id,user_id = request.user.id)
        like.save()
        return Response('you have liked this post',201)
    else:  #unike
        like.delete()
        return Response('you have unliked this post',200)
    

@extend_schema(
    tags=['Likes'],
    summary='Get all likes for a post',
    description='Retrieve all users who liked a specific post with their profile information.',
    responses={
        200: {
            'type': 'object',
            'properties': {
                'likers': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'user': {'type': 'integer'},
                            'pfp': {'type': 'string', 'format': 'uri'},
                            'bio': {'type': 'string'},
                            'location': {'type': 'string'},
                            'website': {'type': 'string'},
                            'birth_date': {'type': 'string', 'format': 'date'},
                            'gender': {'type': 'string'}
                        }
                    }
                },
                'total': {'type': 'integer', 'description': 'Total number of likes'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the post to get likes for',
            required=True,
            type=int
        )
    ]
)
@api_view(['GET'])
def get_all_likes(request,post_id):
    likers_ids = Like.objects.filter(post=post_id).values_list('user',flat=True)
    likers = Profile.objects.filter(user_id__in = likers_ids)
    likers_ser = ProfileSerializer(likers,many=True)
    return Response({
        'likers':likers_ser.data,
        'total' : likers.count()
    },
    200
    )


  