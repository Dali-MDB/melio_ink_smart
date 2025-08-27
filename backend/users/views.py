from rest_framework.decorators import api_view,permission_classes,APIView
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveUpdateAPIView,ListAPIView
from .models import Profile,User
from .serializers import ProfileSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from posts.serializers import PostSerializer
from posts.models import Post
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import status
from posts.filters import PostFilter
from django_filters.rest_framework import DjangoFilterBackend


@extend_schema(
    tags=['Users'],
    summary='Get current user profile',
    description='Retrieve the profile information of the currently authenticated user.',
    methods=['GET'],
    responses={
        200: ProfileSerializer
    }
)
@extend_schema(
    tags=['Users'],
    summary='Update current user profile',
    description='Update the profile information of the currently authenticated user.',
    methods=['PUT'],
    request=ProfileSerializer,
    responses={
        200: ProfileSerializer,
        400: {
            'type': 'object',
            'properties': {
                'field_name': {'type': 'array', 'items': {'type': 'string'}}
            }
        }
    }
)
class MyProfileViewUpdate(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        profile = user.profile
        prof_ser = ProfileSerializer(profile)
        return Response(prof_ser.data)
    
    def put(self,request):
        user = request.user
        profile = user.profile
        data = request.data
        prof_ser = ProfileSerializer(profile,data=data,partial=True)
        if prof_ser.is_valid():
            prof_ser.save()
            return Response(prof_ser.data,200)
        return Response(prof_ser.errors,400)


@extend_schema(
    tags=['Users'],
    summary='View user profile',
    description='Retrieve the profile information of a specific user by their ID.',
    responses={
        200: ProfileSerializer,
        404: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'Not found.'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='user_id',
            location=OpenApiParameter.PATH,
            description='ID of the user whose profile to view',
            required=True,
            type=int
        )
    ]
)
@api_view(['GET'])
def view_profile(request,user_id):
    user = get_object_or_404(User,id=user_id)
    profile = user.profile
    prof_ser = ProfileSerializer(profile)
    return Response(prof_ser.data)


@extend_schema(
    tags=['Users'],
    summary='List user posts',
    description='Retrieve all posts created by a specific user.',
    responses={
        200: PostSerializer(many=True)
    },
    parameters=[
        OpenApiParameter(
            name='user_id',
            location=OpenApiParameter.PATH,
            description='ID of the user whose posts to retrieve',
            required=True,
            type=int
        )
    ]
)
class ListUserPosts(ListAPIView):
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(User,id=user_id)
        posts = Post.objects.filter(owner=user).order_by('created_at')
        return posts


@extend_schema(
    tags=['Users'],
    summary='Get current user info',
    description='Get basic information about the currently authenticated user.',
    responses={
        200: {
            'type': 'object',
            'properties': {
                'is_auth': {'type': 'boolean', 'nullable': True, 'description': 'Whether user is authenticated'},
                'id': {'type': 'integer', 'nullable': True, 'description': 'User ID if authenticated'}
            }
        }
    }
)
@api_view(['GET'])
def current_user_info(request):
    return Response({
        'is_auth' : request.user.is_authenticated if request.user else None,
        'id' :  request.user.id if request.user else None,
    })




