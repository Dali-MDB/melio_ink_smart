from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from .permissions import IsAdminOrReadOnly
from .models import Tag
from .serializers import TagSerializer
from rest_framework.decorators import permission_classes,api_view
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Q


class TagsListCreate(ListCreateAPIView):
    """
    List and create tags
    
    Goal: Get all available tags or create a new tag
    Path: GET/POST /posts/tags/
    Authentication: Required for POST (Admin only), not required for GET
    
    Request Body (POST):
    {
        "name": "Tag Name"
    }
    
    Response:
    - GET 200: [TagSerializer objects]
    - POST 201: TagSerializer object
    - POST 400: {"field_name": ["error message"]}
    - POST 403: {"detail": "You do not have permission to perform this action."}
    """
    permission_classes = [IsAdminOrReadOnly]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

   

class TagsViewUpdateDelete(RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete a specific tag
    
    Goal: Retrieve, update, or delete a specific tag by its ID
    Path: GET/PUT/PATCH/DELETE /posts/tags/<int:id>/
    Authentication: Required for PUT/PATCH/DELETE (Admin only), not required for GET
    
    Request Body (PUT/PATCH):
    {
        "name": "Updated Tag Name"
    }
    
    Response:
    - GET 200: TagSerializer object
    - PUT/PATCH 200: TagSerializer object
    - DELETE 204: No content
    - 400: {"field_name": ["error message"]}
    - 403: {"detail": "You do not have permission to perform this action."}
    - 404: {"detail": "Not found."}
    """
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


@api_view(['POST'])
@permission_classes([IsAdminUser])
def tagsBulkCreate(request):
    """
    Bulk create tags
    
    Goal: Create multiple tags at once. Only creates tags that do not already exist (case insensitive)
    Path: POST /posts/tags/bulk/
    Authentication: Required (Admin only)
    
    Request Body:
    {
        "tag_names": ["Tag1", "Tag2", "Tag3"]
    }
    
    Response:
    - 200: {"detail": "5 have been created succssfully"}
    - 403: {"detail": "You do not have permission to perform this action."}
    """
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
    
    
