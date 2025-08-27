from django.shortcuts import render
from rest_framework.generics import GenericAPIView,ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.decorators import permission_classes,api_view
from rest_framework.views import APIView
from .serializers import PostSerializer
from .models import Post
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.http import FileResponse
from .permissions import PostPermission
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PostFilter


@extend_schema(
    tags=['Posts'],
    summary='List and create posts',
    description='Get a list of all posts or create a new post. Authentication required for creating posts.',
    methods=['GET'],
    responses={
        200: PostSerializer(many=True)
    }
)
@extend_schema(
    tags=['Posts'],
    summary='Create a new post',
    description='Create a new post. Authentication required.',
    methods=['POST'],
    request=PostSerializer,
    responses={
        201: PostSerializer,
        400: {
            'type': 'object',
            'properties': {
                'field_name': {'type': 'array', 'items': {'type': 'string'}}
            }
        }
    }
)
class PostsListCreate(ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all().order_by('-created_at')
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    

@extend_schema(
    tags=['Posts'],
    summary='Get a specific post',
    description='Retrieve a specific post by its ID.',
    methods=['GET'],
    responses={
        200: PostSerializer,
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
            location=OpenApiParameter.PATH,
            description='ID of the post to retrieve',
            required=True,
            type=int
        )
    ]
)
@extend_schema(
    tags=['Posts'],
    summary='Update a post',
    description='Update a specific post. Only the post owner can update it.',
    methods=['PUT', 'PATCH'],
    request=PostSerializer,
    responses={
        200: PostSerializer,
        400: {
            'type': 'object',
            'properties': {
                'field_name': {'type': 'array', 'items': {'type': 'string'}}
            }
        },
        403: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'You do not have permission to perform this action.'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the post to update',
            required=True,
            type=int
        )
    ]
)
@extend_schema(
    tags=['Posts'],
    summary='Delete a post',
    description='Delete a specific post. Only the post owner can delete it.',
    methods=['DELETE'],
    responses={
        204: OpenApiResponse(description='Post deleted successfully'),
        403: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'You do not have permission to perform this action.'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the post to delete',
            required=True,
            type=int
        )
    ]
)
class PostRetrieveUpdateDelete(RetrieveUpdateDestroyAPIView):
    lookup_field = 'post_id'
    serializer_class = PostSerializer
    queryset = Post.objects.all().order_by('-created_at')
    permission_classes = [PostPermission]

    
    def get_object(self):
        post_id = self.kwargs.get('post_id')
        return get_object_or_404(Post, id=post_id)
    



@extend_schema(
    tags=['Posts'],
    summary='Manage post image',
    description='Get, upload, or delete the image associated with a specific post.',
    methods=['GET'],
    responses={
        200: OpenApiResponse(
            description='Post image file',
            response=OpenApiTypes.BINARY
        ),
        204: OpenApiResponse(
            description='No image found for this post'
        )
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the post',
            required=True,
            type=int
        )
    ]
)
@extend_schema(
    tags=['Posts'],
    summary='Upload post image',
    description='Upload an image for a specific post. If an image already exists, it will be replaced.',
    methods=['POST'],
    request={
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'image': {
                    'type': 'string',
                    'format': 'binary',
                    'description': 'Image file to upload'
                }
            }
        }
    },
    responses={
        201: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'the image has been uploaded successfully'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the post',
            required=True,
            type=int
        )
    ]
)
@extend_schema(
    tags=['Posts'],
    summary='Delete post image',
    description='Delete the image associated with a specific post.',
    methods=['DELETE'],
    responses={
        201: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'the image has been deleted successfully'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the post',
            required=True,
            type=int
        )
    ]
)
class PostImage(APIView):
    permission_classes = [PostPermission]
    
    def get(self,request,post_id):
        self.check_permissions(request)
        post = get_object_or_404(Post,id=post_id)
        if post.image:
            return FileResponse(post.image,as_attachment=False)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def post(self,request,post_id):
        post = get_object_or_404(Post,id=post_id)
        self.check_object_permissions(request,post)
        if post.image:
            post.image.delete()
            post.save()
        image = request.FILES.get('image')
        post.image = image
        post.save()
        return Response('the image has been uploaded successfully',status=201)


    def delete(self,request,post_id):
        post = get_object_or_404(Post,id=post_id)
        self.check_object_permissions(request,post)
        if post.image:
            post.image.delete()
            post.save()
        return Response('the image has been deleted successfully',status=201)








from datetime import datetime
        
@extend_schema(
    tags=['Posts'],
    summary='Publish a draft post',
    description='Change the status of a draft post to published and update the creation timestamp.',
    request=None,
    responses={
        200: PostSerializer,
        400: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'this post is not a draft'}
            }
        },
        403: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'You do not have permission to perform this action.'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the draft post to publish',
            required=True,
            type=int
        )
    ]
)
@api_view(['POST'])
@permission_classes([IsAuthenticated,PostPermission])
def publish_draft(request,post_id):
    post = get_object_or_404(Post,id=post_id)
    permission = PostPermission()
    permission.has_object_permission(request,None,post)
    if post.status != 'DRAFT':
        return Response(data={'detail':'this post is not a draft'},status=status.HTTP_400_BAD_REQUEST)
    post.status = 'PUBLISHED'
    post.created_at = datetime.now()
    return Response(PostSerializer(post).data)


@extend_schema(
    tags=['Posts'],
    summary='Save or unsave a post',
    description='Toggle save status for a specific post. If the post is not saved, it will be saved. If already saved, it will be unsaved.',
    request=None,
    responses={
        200: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'The post has been saved successfully'}
            }
        },
        400: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'no post_id was provided'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.QUERY,
            description='ID of the post to save/unsave',
            required=True,
            type=int
        )
    ]
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_post(request):
    post_id = request.GET.get('post_id', None)
    if not post_id:
        return Response({'detail': 'no post_id was provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    post = get_object_or_404(Post, id=post_id)
    
    # Check if post is published
    if post.status != 'PUBLISHED':
        return Response({'detail': 'Cannot save a draft post'}, status=status.HTTP_400_BAD_REQUEST)
    
    # More efficient check using exists()
    if request.user.saved_posts.filter(id=post_id).exists():
        request.user.saved_posts.remove(post)
        return Response({'detail': 'The post has been removed from saved successfully'})
    else:
        request.user.saved_posts.add(post)
        return Response({'detail': 'The post has been saved successfully'})


@extend_schema(
    tags=['Posts'],
    summary='Get saved posts',
    description='Retrieve all posts that the authenticated user has saved.',
    responses={
        200: PostSerializer(many=True)
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_posts(request):
    # Only get published posts that are saved by the user
    posts = request.user.saved_posts.filter(status='PUBLISHED')
    return Response(PostSerializer(posts, many=True).data)
