from django.shortcuts import render
from rest_framework.generics import GenericAPIView,ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework.decorators import permission_classes,api_view
from rest_framework.views import APIView
from .srializers import PostSerializer
from .models import Post
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.http import FileResponse
from .permissions import PostPermission
from rest_framework import status



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
        return Response('the image hass been uploaded successfully',status=201)


    def delete(self,request,post_id):
        post = get_object_or_404(Post,id=post_id)
        self.check_object_permissions(request,post)
        if post.image:
            post.image.delete()
            post.save()
        return Response('the image hass been deleted successfully',status=201)








    
        
