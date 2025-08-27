from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from .permissions import IsAdminOrReadOnly
from .models import Tag
from .serializers import TagSerializer
from rest_framework.decorators import permission_classes,api_view
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse


@extend_schema(
    tags=['Tags'],
    summary='List and create tags',
    description='Get all available tags or create a new tag. Admin required for creation.',
    methods=['GET'],
    responses={
        200: TagSerializer(many=True)
    }
)
@extend_schema(
    tags=['Tags'],
    summary='Create a new tag',
    description='Create a new tag. Admin privileges required.',
    methods=['POST'],
    request=TagSerializer,
    responses={
        201: TagSerializer,
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
    }
)
class TagsListCreate(ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

   

@extend_schema(
    tags=['Tags'],
    summary='Get a specific tag',
    description='Retrieve a specific tag by its ID.',
    methods=['GET'],
    responses={
        200: TagSerializer,
        404: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'Not found.'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='id',
            location=OpenApiParameter.PATH,
            description='ID of the tag to retrieve',
            required=True,
            type=int
        )
    ]
)
@extend_schema(
    tags=['Tags'],
    summary='Update a tag',
    description='Update a specific tag. Admin privileges required.',
    methods=['PUT', 'PATCH'],
    request=TagSerializer,
    responses={
        200: TagSerializer,
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
            name='id',
            location=OpenApiParameter.PATH,
            description='ID of the tag to update',
            required=True,
            type=int
        )
    ]
)
@extend_schema(
    tags=['Tags'],
    summary='Delete a tag',
    description='Delete a specific tag. Admin privileges required.',
    methods=['DELETE'],
    responses={
        204: OpenApiResponse(description='Tag deleted successfully'),
        403: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'You do not have permission to perform this action.'}
            }
        }
    },
    parameters=[
        OpenApiParameter(
            name='id',
            location=OpenApiParameter.PATH,
            description='ID of the tag to delete',
            required=True,
            type=int
        )
    ]
)
class TagsViewUpdateDelete(RetrieveUpdateDestroyAPIView):
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


@extend_schema(
    tags=['Tags'],
    summary='Bulk create tags',
    description='Create multiple tags at once. Only creates tags that do not already exist (case insensitive). Admin privileges required.',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'tag_names': {
                    'type': 'array',
                    'items': {'type': 'string'},
                    'description': 'List of tag names to create'
                }
            },
            'required': ['tag_names']
        }
    },
    responses={
        200: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': '5 have been created succssfully'}
            }
        },
        403: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'You do not have permission to perform this action.'}
            }
        }
    }
)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def tagsBulkCreate(request):
    tag_names = set(request.data.get('tag_names',[]))
    #we query for tag names already existing in our db
   
    query = Q()
    for name in tag_names:
        query |= Q(name__iexact=name)   #case insensitive in
    exist = set(Tag.objects.filter(query).values_list('name',flat=True))
    tags_to_be_created = tag_names - exist
    l = 0
    for name in tags_to_be_created:
        l+=1
        tag = Tag.objects.create(name=name)
        tag.save()
    return Response(f'{l} have been created succssfully')
    
    
