from rest_framework.decorators import api_view,permission_classes
from django.shortcuts import get_object_or_404
from .models import Like,Post
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.serializers import ProfileSerializer
from users.models import User,Profile
from rest_framework import status
from .email import send_mail

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request,post_id):
    """
    Like or unlike a post
    
    Goal: Toggle like status for a specific post. If the post is not liked, it will be liked. If already liked, it will be unliked.
    Path: POST /posts/<int:post_id>/like/
    Authentication: Required
    
    Request Body: None
    
    Response:
    - 200: {"detail": "you have unliked this post"}
    - 201: {"detail": "you have liked this post"}
    """
    like = Like.objects.filter(post_id=post_id,user_id = request.user.id).first()
    if not like:   #we create a like
        like = Like.objects.create(post_id=post_id,user_id = request.user.id)
        like.save()
        #check if the owner accepts notifications
        post = get_object_or_404(Post, id=post_id)
        if post.owner.profile.accept_notifications:
            send_mail(post.owner.email, 'New like', f'You have a new like on your post {post.title}')
        return Response('you have liked this post',201)
    else:  #unike
        like.delete()
        return Response('you have unliked this post',200)
    

@api_view(['GET'])
def get_all_likes(request,post_id):
    """
    Get all likes for a post
    
    Goal: Retrieve all users who liked a specific post with their profile information.
    Path: GET /posts/<int:post_id>/likes/
    Authentication: Not required
    
    Request Body: None
    
    Response:
    - 200: {
        "likers": [
            {
                "id": 1,
                "user": 1,
                "pfp": "http://example.com/pfp.jpg",
                "bio": "User bio",
                "location": "City, Country",
                "website": "https://example.com",
                "birth_date": "1990-01-01",
                "gender": "M"
            }
        ],
        "total": 5
    }
    """
    likers_ids = Like.objects.filter(post=post_id).values_list('user',flat=True)
    likers = Profile.objects.filter(user_id__in = likers_ids)
    likers_ser = ProfileSerializer(likers,many=True)
    return Response({
        'likers':likers_ser.data,
        'total' : likers.count()
    },
    200
    )


  