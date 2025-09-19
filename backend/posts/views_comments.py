from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView,ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .permissions import PostPermission
from .serializers import CommentSerializer
from django.shortcuts import get_object_or_404
from .models import Post,Comment
from rest_framework.throttling import UserRateThrottle
from rest_framework.permissions import IsAuthenticated
from .email import send_mail

class CommentListCreate(ListCreateAPIView):
    """
    List and create comments
    
    Goal: Get all comments for a specific post or create a new comment
    Path: GET/POST /posts/<int:post_id>/comments/
    Authentication: Required for POST, not required for GET
    Rate Limiting: UserRateThrottle for POST requests
    
    Request Body (POST):
    {
        "content": "Comment content..."
    }
    
    Query Parameters (POST):
    - parent_comment_id (optional): ID of parent comment for replies
    
    Response:
    - GET 200: [CommentSerializer objects]
    - POST 201: CommentSerializer object
    - POST 400: {"field_name": ["error message"]}
    """
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
            except:  #set to None
                parent_comment = None
        else:
            parent_comment = None



        serializer.save(owner = self.request.user, parent_comment = parent_comment,post=post)
        #check if the owner accepts notifications
        if self.request.user.profile.accept_notifications:
            send_mail(self.request.user.email, 'New comment', f'You have a new comment on your post {post.title}')

    def get_queryset(self):
        post = self.get_object()
        return Comment.objects.filter(post=post,parent_comment=None).order_by('-created_at')


class CommentRetrieveUpdateDelete(RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete a specific comment
    
    Goal: Retrieve, update, or delete a specific comment by its ID
    Path: GET/PUT/PATCH/DELETE /posts/<int:post_id>/comments/<int:comment_id>/
    Authentication: Required for PUT/PATCH/DELETE, not required for GET
    
    Request Body (PUT/PATCH):
    {
        "content": "Updated comment content..."
    }
    
    Response:
    - GET 200: CommentSerializer object
    - PUT/PATCH 200: CommentSerializer object
    - DELETE 204: No content
    - 400: {"field_name": ["error message"]}
    - 403: {"detail": "You do not have permission to perform this action."}
    - 404: {"detail": "Not found."}
    """
    lookup_field = 'comment_id'
    serializer_class = CommentSerializer
    queryset = Comment.objects.all().order_by('-created_at')
    permission_classes = [PostPermission]

    def get_object(self):
        comment_id = self.kwargs.get('comment_id')
        return get_object_or_404(Comment, id=comment_id)




class UserComments(ListAPIView):
    """
    Fetch all comments of a user
    
    Goal: Retrieve all comments created by the authenticated user
    Path: GET /posts/user/comments/
    Authentication: Required
    
    Request Body: None
    
    Response:
    - 200: [CommentSerializer objects]
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer
    def get_queryset(self):
        user = self.request.user
        return Comment.objects.filter(owner=user).order_by('-created_at')


class LikeComment(APIView):
    """
    Like or unlike a comment
    
    Goal: Toggle like status for a specific comment. If already liked, it will be unliked.
    Path: POST /posts/<int:post_id>/comments/<int:comment_id>/like/
    Authentication: Required
    
    Request Body: None
    
    Response:
    - 200: {
        "message": "Comment liked successfully" or "Comment unliked successfully",
        "is_liked": true/false,
        "likes_count": 5
    }
    - 404: {"detail": "Comment not found."}
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, post_id=post_id)
        user = request.user
        
        # Check if user has already liked this comment
        if comment.likes.filter(id=user.id).exists():
            # Unlike the comment
            comment.likes.remove(user)
            is_liked = False
            message = 'Comment unliked successfully'
        else:
            # Like the comment
            comment.likes.add(user)
            is_liked = True
            message = 'Comment liked successfully'
        
        likes_count = comment.likes.count()
        
        return Response({
            'message': message,
            'is_liked': is_liked,
            'likes_count': likes_count
        }, status=status.HTTP_200_OK)