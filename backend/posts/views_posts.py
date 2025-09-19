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
from django_filters.rest_framework import DjangoFilterBackend
from .filters import PostFilter
from django.db import transaction
from .models import Tag


class PostsListCreate(ListCreateAPIView):
    """
    List and create posts
    
    Goal: Get a list of all published posts or create a new post
    Path: GET/POST /posts/
    Authentication: Required for POST, not required for GET
    
    Request Body (POST):
    {
        "title": "Post Title",
        "content": "Post content...",
        "tags": ["tag1", "tag2"],
        "image": "file (optional)",
        "summary": "Optional summary"
    }
    
    Response:
    - GET 200: [PostSerializer objects]
    - POST 201: PostSerializer object
    - POST 400: {"field_name": ["error message"]}
    """
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status='PUBLISHED').order_by('-created_at')
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter

    def perform_create(self, serializer):
        post =serializer.save(owner=self.request.user)

    def get_permissions(self):
        print(self.request.data)
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    

class PostRetrieveUpdateDelete(RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete a specific post
    
    Goal: Retrieve, update, or delete a specific post by its ID
    Path: GET/PUT/PATCH/DELETE /posts/<int:post_id>/
    Authentication: Required for PUT/PATCH/DELETE, not required for GET
    
    Request Body (PUT/PATCH):
    {
        "title": "Updated Title",
        "content": "Updated content...",
        "tags": ["tag1", "tag2"],
        "summary": "Updated summary"
    }
    
    Response:
    - GET 200: PostSerializer object
    - PUT/PATCH 200: PostSerializer object
    - DELETE 204: No content
    - 400: {"field_name": ["error message"]}
    - 403: {"detail": "You do not have permission to perform this action."}
    - 404: {"detail": "Not found."}
    """
    lookup_field = 'post_id'
    serializer_class = PostSerializer
    queryset = Post.objects.all().order_by('-created_at')
    permission_classes = [PostPermission]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    
    def get_object(self):
        post_id = self.kwargs.get('post_id')
        return get_object_or_404(Post, id=post_id)
    



class PostImage(APIView):
    """
    Manage post image
    
    Goal: Get, upload, or delete the image associated with a specific post
    Path: GET/POST/DELETE /posts/<int:post_id>/image/
    Authentication: Required for POST/DELETE, not required for GET
    
    Request Body (POST):
    - multipart/form-data with 'image' field containing the image file
    
    Response:
    - GET 200: Image file (binary)
    - GET 204: No image found for this post
    - POST 201: {"detail": "the image has been uploaded successfully"}
    - DELETE 201: {"detail": "the image has been deleted successfully"}
    - 403: {"detail": "You do not have permission to perform this action."}
    - 404: {"detail": "Not found."}
    """
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
        
@api_view(['POST'])
@permission_classes([IsAuthenticated,PostPermission])
def publish_draft(request,post_id):
    """
    Publish a draft post
    
    Goal: Change the status of a draft post to published and update the creation timestamp
    Path: POST /posts/<int:post_id>/publish/
    Authentication: Required
    
    Request Body: None
    
    Response:
    - 200: PostSerializer object
    - 400: {"detail": "this post is not a draft"}
    - 403: {"detail": "You do not have permission to perform this action."}
    - 404: {"detail": "Not found."}
    """
    post = get_object_or_404(Post,id=post_id)
    permission = PostPermission()
    permission.has_object_permission(request,None,post)
    if post.status != 'DRAFT':
        return Response(data={'detail':'this post is not a draft'},status=status.HTTP_400_BAD_REQUEST)
    post.status = 'PUBLISHED'
    post.created_at = datetime.now()
    return Response(PostSerializer(post).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_post(request):
    """
    Save or unsave a post
    
    Goal: Toggle save status for a specific post. If the post is not saved, it will be saved. If already saved, it will be unsaved.
    Path: POST /posts/save_post/?post_id=<int>
    Authentication: Required
    
    Request Body: None
    Query Parameters: post_id (required)
    
    Response:
    - 200: {"detail": "The post has been saved successfully"} or {"detail": "The post has been removed from saved successfully"}
    - 400: {"detail": "no post_id was provided"} or {"detail": "Cannot save a draft post"}
    - 404: {"detail": "Not found."}
    """
    post_id = request.GET.get('post_id', None)
    if not post_id:
        return Response({'detail': 'no post_id was provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    post = get_object_or_404(Post, id=post_id)
    print("here1")
    # Check if post is published
    if post.status != 'PUBLISHED':
        return Response({'detail': 'Cannot save a draft post'}, status=status.HTTP_400_BAD_REQUEST)
    print("here2")
    # More efficient check using exists()
    if request.user.saved_posts.filter(id=post_id).exists():
        request.user.saved_posts.remove(post)
        return Response({'detail': 'The post has been removed from saved successfully'})
    else:
        request.user.saved_posts.add(post)
        return Response({'detail': 'The post has been saved successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_posts(request):
    """
    Get saved posts
    
    Goal: Retrieve all posts that the authenticated user has saved
    Path: GET /posts/saved/
    Authentication: Required
    
    Request Body: None
    
    Response:
    - 200: [PostSerializer objects]
    """
    # Only get published posts that are saved by the user
    posts = request.user.saved_posts.filter(status='PUBLISHED')
    return Response(PostSerializer(posts, many=True).data)






