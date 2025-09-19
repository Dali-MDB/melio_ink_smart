from rest_framework.decorators import api_view,permission_classes,APIView
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveUpdateAPIView,ListAPIView
from .models import Profile,User
from .serializers import ProfileSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from posts.serializers import PostSerializer
from posts.models import Post
from rest_framework import status
from posts.filters import PostFilter
from django_filters.rest_framework import DjangoFilterBackend


class MyProfileViewUpdate(APIView):
    """
    Get and update current user profile
    
    Goal: Retrieve or update the profile information of the currently authenticated user
    Path: GET/PUT /users/profile/me/
    Authentication: Required
    
    Request Body (PUT):
    {
        "first_name": "John",
        "last_name": "Doe",
        "age": 25,
        "phone": "+1234567890",
        "accept_notifications": true
    }
    
    Response:
    - GET 200: ProfileSerializer object
    - PUT 200: ProfileSerializer object
    - PUT 400: {"field_name": ["error message"]}
    """
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
    """
    View user profile
    
    Goal: Retrieve the profile information of a specific user by their ID
    Path: GET /users/<int:user_id>/profile/
    Authentication: Not required
    
    Request Body: None
    
    Response:
    - 200: ProfileSerializer object
    - 404: {"detail": "Not found."}
    """
    user = get_object_or_404(User,id=user_id)
    profile = user.profile
    prof_ser = ProfileSerializer(profile)
    return Response(prof_ser.data)


class ListUserPosts(ListAPIView):
    """
    List user posts
    
    Goal: Retrieve all published posts created by a specific user
    Path: GET /users/<int:user_id>/posts/
    Authentication: Not required
    
    Request Body: None
    
    Response:
    - 200: [PostSerializer objects]
    - 404: {"detail": "Not found."}
    """
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter


    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        user = get_object_or_404(User,id=user_id)
        posts = Post.objects.filter(owner=user,status='PUBLISHED').order_by('created_at')
        return posts


class ListUserDrafts(ListAPIView):
    """
    List user drafts
    
    Goal: Retrieve all draft posts created by the authenticated user
    Path: GET /users/drafts/
    Authentication: Required
    
    Request Body: None
    
    Response:
    - 200: [PostSerializer objects]
    """
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PostFilter
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        posts = Post.objects.filter(owner=user,status='DRAFT').order_by('created_at')
        return posts

@api_view(['GET'])
def current_user_info(request):
    """
    Get current user info
    
    Goal: Get basic information about the currently authenticated user
    Path: GET /users/current/
    Authentication: Not required
    
    Request Body: None
    
    Response:
    - 200: {
        "is_auth": true/false,
        "id": 1 (if authenticated) or null (if not authenticated)
    }
    """
    return Response({
        'is_auth' : request.user.is_authenticated if request.user else None,
        'id' :  request.user.id if request.user else None,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    """
    Upload profile picture
    
    Goal: Upload a profile picture for the currently authenticated user
    Path: POST /users/profile/picture/
    Authentication: Required
    
    Request Body:
    - multipart/form-data with 'pfp' field containing the image file
    
    Response:
    - 200: {"message": "Profile picture uploaded successfully"}
    - 400: {"message": "No profile picture file found in request"}
    """
    
    user = request.user
    profile = user.profile
    
    if profile.pfp:

        profile.pfp.delete()
    
    pfp_file = request.FILES.get('pfp')
    
    if pfp_file:
        profile.pfp = pfp_file
        profile.save()


    else:
        return Response({'message': 'No profile picture file found in request'},status=status.HTTP_400_BAD_REQUEST)

    
    return Response({'message': 'Profile picture uploaded successfully'},status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_profile_picture(request):
    """
    Remove profile picture
    
    Goal: Remove the profile picture for the currently authenticated user
    Path: DELETE /users/profile/picture/
    Authentication: Required
    
    Request Body: None
    
    Response:
    - 200: {"message": "Profile picture removed successfully"}
    """
    user = request.user
    profile = user.profile
    if profile.pfp:
        profile.pfp.delete()
    profile.pfp = None
    profile.save()
    return Response({'message': 'Profile picture removed successfully'},status=status.HTTP_200_OK)



