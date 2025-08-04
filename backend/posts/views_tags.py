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
    permission_classes = [IsAdminOrReadOnly]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

   

class TagsViewUpdateDelete(RetrieveUpdateDestroyAPIView):
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


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
    
    
