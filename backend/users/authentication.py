from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer,ProfileSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


def generate_tokens(user):
    token = RefreshToken.for_user(user)
    access_token = str(token.access_token)
    refresh_token = str(token)
    return refresh_token,access_token


@api_view(['POST'])
def register(request):
    """
    Register a new user
    
    Goal: Create a new user account and return authentication tokens
    Path: POST /users/auth/register/
    Authentication: Not required
    
    Request Body:
    {
        "username": "johndoe",
        "email": "john@example.com",
        "password": "securepassword",
        "first_name": "John",
        "last_name": "Doe",
        "bio": "User bio",
        "location": "City, Country",
        "website": "https://example.com",
        "birth_date": "1990-01-01",
        "gender": "M"
    }
    
    Response:
    - 200: {
        "detail": "the user has been registered successfully",
        "refresh_token": "jwt_refresh_token",
        "access_token": "jwt_access_token"
    }
    - 400: {"field_name": ["error message"]}
    """
    prof_ser = ProfileSerializer(data=request.data)
    if prof_ser.is_valid():
        user = prof_ser.save()
        #we generate the refresh and access token
        refresh_token,access_token = generate_tokens(user)
        return Response(
            {       
                'detail':'the user has been registered successfully',
                'refresh_token' : refresh_token,
                'access_token' : access_token,
            },
            status=status.HTTP_200_OK
        )
    return Response(prof_ser.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    """
    Login user
    
    Goal: Authenticate user with email and password and return authentication tokens
    Path: POST /users/auth/login/
    Authentication: Not required
    
    Request Body:
    {
        "email": "john@example.com",
        "password": "securepassword"
    }
    
    Response:
    - 200: {
        "refresh_token": "jwt_refresh_token",
        "access_token": "jwt_access_token"
    }
    - 401: {"error": "Invalid credentials"}
    - 404: {"detail": "no user with the provided credentials was found"}
    """
    email = request.data.get('email',None)
    password = request.data.get('password',None)
    if not email or not password:
        raise ValidationError(detail='the email and password fields are required')
    #get the user with this email
    user = User.objects.filter(email=email).first()
    if not user:
        return Response(
            {'detail':'no user with the provided credentials was found'},
            status=status.HTTP_404_NOT_FOUND
        )
    #we authenticated the user
    user = authenticate(username=user.username,password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    #generate tokens for the user
    #we generate the refresh and access token
    refresh_token,access_token = generate_tokens(user)
    return Response(
            {       
                'refresh_token' : refresh_token,
                'access_token' : access_token,
            },
            status=status.HTTP_200_OK
        )

    

@api_view(['POST'])
def get_access_token(request):
    """
    Get new access token
    
    Goal: Use refresh token to get a new access token
    Path: POST /users/auth/access_token/
    Authentication: Not required
    
    Request Body:
    {
        "refresh": "jwt_refresh_token"
    }
    
    Response:
    - 200: {"access_token": "new_jwt_access_token"}
    - 400: {"detail": "no refresh token was provided"}
    - 408: {"detail": "the refresh token has been expired, please login again"}
    """
    refresh_token = request.data.get('refresh',None)
    if not refresh_token:
        return Response('no refresh token was provided',400)
    token = RefreshToken(refresh_token)
    if token.check_exp():
        return Response({'detail':'the refresh token has been expired, please login again'},status=status.HTTP_408_REQUEST_TIMEOUT)
    access_token = str(token.access_token)
    return Response({'access_token': access_token}, status=status.HTTP_200_OK)