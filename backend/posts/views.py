from django.shortcuts import render
from rest_framework.generics import GenericAPIView,ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.decorators import permission_classes,api_view
from .srializers import PostSerializer
from .models import Post
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .permissions import PostPermission



class PostsListCreate(ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner = self.request.user)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    


class PostRetrieveUpdateDelete(RetrieveUpdateDestroyAPIView):
    lookup_field = 'id'
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [PostPermission]

    
    def get_object(self):
        post_id = self.kwargs.get('post_id')
        return get_object_or_404(Post, id=post_id)
    


@api_view(['POST'])
def upload_post_photo(request,post_id:int):
    post = get_object_or_404(Post,id=post_id)
    image = request.FILES.get('image')
    post.image = image
    post.save()
    return Response('the image hass been uploaded successfullt',status=201)






    
        
