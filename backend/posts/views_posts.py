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



class PostsListCreate(ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all().order_by('-created_at')
    filter_backends = [DjangoFilterBackend]
    filterset_fields = PostFilter

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    


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








    
        
