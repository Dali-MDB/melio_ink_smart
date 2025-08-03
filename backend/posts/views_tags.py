from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from .permissions import IsAdminOrReadOnly
from .models import Tag
from .serializers import TagSerializer


class TagsListCreate(ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

   

class TagsViewUpdateDelete(RetrieveUpdateDestroyAPIView):
    lookup_field = 'id'
    permission_classes = [IsAdminOrReadOnly]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

