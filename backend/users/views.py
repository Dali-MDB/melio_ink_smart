from rest_framework.decorators import api_view,permission_classes,APIView
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveUpdateAPIView,ListAPIView
from .models import Profile,User
from .serializers import ProfileSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from posts.serializers import PostSerializer
from posts.models import Post


class MyProfileViewUpdate(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        profile = user.profile
        prof_ser = ProfileSerializer(profile)
        return Response(prof_ser.data)
    
    def put(self,request):
        user = request.user
        profile = user.profile
        data = request.data
        prof_ser = ProfileSerializer(profile,data=data,partial=True)
        if prof_ser.is_valid():
            prof_ser.save()
            return Response(prof_ser.data,200)
        return Response(prof_ser.errors,400)


@api_view(['GET'])
def view_profile(request,user_id):
    user = get_object_or_404(User,id=user_id)
    profile = user.profile
    prof_ser = ProfileSerializer(profile)
    return Response(prof_ser.data)



class ListUserPosts(ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(User,id=user_id)
        posts = Post.objects.filter(owner=user).order_by('created_at')
        return posts


@api_view(['GET'])
def current_user_info(request):
    return Response({
        'is_auth' : request.user.is_authenticated if request.user else None,
        'id' :  request.user.id if request.user else None,
    })




