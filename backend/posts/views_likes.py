from rest_framework.decorators import api_view,permission_classes
from django.shortcuts import get_object_or_404
from .models import Like,Post
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.serializers import ProfileSerializer
from users.models import User,Profile

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request,post_id):
    like = Like.objects.filter(post_id=post_id,user_id = request.user.id).first()
    if not like:   #we create a like
        like = Like.objects.create(post_id=post_id,user_id = request.user.id)
        like.save()
        return Response('you have liked this post',201)
    else:  #unike
        like.delete()
        return Response('you have unliked this post',200)
    

@api_view(['GET'])
def get_all_likes(request,post_id):
    likers_ids = Like.objects.filter(post=post_id).values_list('user',flat=True)
    likers = Profile.objects.filter(user_id__in = likers_ids)
    likers_ser = ProfileSerializer(likers,many=True)
    return Response({
        'likers':likers_ser.data,
        'total' : likers.count()
    },
    200
    )