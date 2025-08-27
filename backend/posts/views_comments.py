from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from .permissions import PostPermission
from .serializers import CommentSerializer
from django.shortcuts import get_object_or_404
from .models import Post,Comment
from rest_framework.throttling import UserRateThrottle
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse


@extend_schema(
    tags=['Comments'],
    summary='List and create comments',
    description='Get all comments for a specific post or create a new comment. Rate limited for creation.',
    methods=['GET'],
    responses={
        200: CommentSerializer(many=True)
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the post to get comments for',
            required=True,
            type=int
        )
    ]
)
@extend_schema(
    tags=['Comments'],
    summary='Create a new comment',
    description='Create a new comment on a specific post. Can be a reply to another comment.',
    methods=['POST'],
    request=CommentSerializer,
    responses={
        201: CommentSerializer,
        400: {
            'type': 'object',
            'properties': {
                'field_name': {'type': 'array', 'items': {'type': 'string'}}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='post_id',
            location=OpenApiParameter.PATH,
            description='ID of the post to comment on',
            required=True,
            type=int
        ),
        OpenApiParameter(
            name='parent_comment_id',
            location=OpenApiParameter.QUERY,
            description='ID of the parent comment (for replies)',
            required=False,
            type=int
        )
    ]
)
class CommentListCreate(ListCreateAPIView):
    permission_classes = [PostPermission]
    serializer_class = CommentSerializer
    def get_throttles(self):
        if self.request.method=='POST':
            return [UserRateThrottle()]
        else:
            return []

    #for the permission class
    def get_object(self):
        post_id = self.kwargs.get('post_id')
        return get_object_or_404(Post, id=post_id)
    
    def perform_create(self, serializer):
        post = self.get_object()
        parent_comment_id = self.request.GET.get('parent_comment_id',None)
        #print(parent_comment_id,"\n"*10)
        if parent_comment_id:
            try:   #try fetching the parent comment
                parent_comment = get_object_or_404(Comment,id=parent_comment_id)
               # print("here",'\n'*10)
            except:  #set to None
                parent_comment = None
        else:
            parent_comment = None



        serializer.save(owner = self.request.user, parent_comment = parent_comment,post=post)

    def get_queryset(self):
        post = self.get_object()
        return Comment.objects.filter(post=post).order_by('-created_at')


@extend_schema(
    tags=['Comments'],
    summary='Get a specific comment',
    description='Retrieve a specific comment by its ID.',
    methods=['GET'],
    responses={
        200: CommentSerializer,
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
            description='ID of the post',
            required=True,
            type=int
        ),
        OpenApiParameter(
            name='comment_id',
            location=OpenApiParameter.PATH,
            description='ID of the comment to retrieve',
            required=True,
            type=int
        )
    ]
)
@extend_schema(
    tags=['Comments'],
    summary='Update a comment',
    description='Update a specific comment. Only the comment owner can update it.',
    methods=['PUT', 'PATCH'],
    request=CommentSerializer,
    responses={
        200: CommentSerializer,
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
            description='ID of the post',
            required=True,
            type=int
        ),
        OpenApiParameter(
            name='comment_id',
            location=OpenApiParameter.PATH,
            description='ID of the comment to update',
            required=True,
            type=int
        )
    ]
)
@extend_schema(
    tags=['Comments'],
    summary='Delete a comment',
    description='Delete a specific comment. Only the comment owner can delete it.',
    methods=['DELETE'],
    responses={
        204: OpenApiResponse(description='Comment deleted successfully'),
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
            description='ID of the post',
            required=True,
            type=int
        ),
        OpenApiParameter(
            name='comment_id',
            location=OpenApiParameter.PATH,
            description='ID of the comment to delete',
            required=True,
            type=int
        )
    ]
)
class CommentRetrieveUpdateDelete(RetrieveUpdateDestroyAPIView):
    lookup_field = 'comment_id'
    serializer_class = CommentSerializer
    queryset = Comment.objects.all().order_by('-created_at')
    permission_classes = [PostPermission]

    def get_object(self):
        comment_id = self.kwargs.get('comment_id')
        return get_object_or_404(Comment, id=comment_id)
