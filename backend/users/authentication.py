from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer,ProfileSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample


def generate_tokens(user):
    token = RefreshToken.for_user(user)
    access_token = str(token.access_token)
    refresh_token = str(token)
    return refresh_token,access_token


@extend_schema(
    tags=['Authentication'],
    summary='Register a new user',
    description='Create a new user account and return authentication tokens.',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'username': {'type': 'string', 'description': 'Username for the new account'},
                'email': {'type': 'string', 'format': 'email', 'description': 'Email address'},
                'password': {'type': 'string', 'description': 'Password for the account'},
                'first_name': {'type': 'string', 'description': 'First name'},
                'last_name': {'type': 'string', 'description': 'Last name'},
                'bio': {'type': 'string', 'description': 'User bio'},
                'location': {'type': 'string', 'description': 'User location'},
                'website': {'type': 'string', 'description': 'User website'},
                'birth_date': {'type': 'string', 'format': 'date', 'description': 'Birth date'},
                'gender': {'type': 'string', 'description': 'Gender'}
            },
            'required': ['username', 'email', 'password']
        }
    },
    responses={
        200: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'the user has been registered successfully'},
                'refresh_token': {'type': 'string', 'description': 'JWT refresh token'},
                'access_token': {'type': 'string', 'description': 'JWT access token'}
            }
        },
        400: {
            'type': 'object',
            'properties': {
                'field_name': {'type': 'array', 'items': {'type': 'string'}}
            }
        }
    }
)
@api_view(['POST'])
def register(request):
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


@extend_schema(
    tags=['Authentication'],
    summary='Login user',
    description='Authenticate user with email and password and return authentication tokens.',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'email': {'type': 'string', 'format': 'email', 'description': 'User email address'},
                'password': {'type': 'string', 'description': 'User password'}
            },
            'required': ['email', 'password']
        }
    },
    responses={
        200: {
            'type': 'object',
            'properties': {
                'refresh_token': {'type': 'string', 'description': 'JWT refresh token'},
                'access_token': {'type': 'string', 'description': 'JWT access token'}
            }
        },
        401: {
            'type': 'object',
            'properties': {
                'error': {'type': 'string', 'example': 'Invalid credentials'}
            }
        },
        404: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'no user with the provided credentials was found'}
            }
        }
    }
)
@api_view(['POST'])
def login(request):
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

    

@extend_schema(
    tags=['Authentication'],
    summary='Get new access token',
    description='Use refresh token to get a new access token.',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'refresh': {'type': 'string', 'description': 'JWT refresh token'}
            },
            'required': ['refresh']
        }
    },
    responses={
        200: {
            'type': 'object',
            'properties': {
                'access_token': {'type': 'string', 'description': 'New JWT access token'}
            }
        },
        400: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'no refresh token was provided'}
            }
        },
        408: {
            'type': 'object',
            'properties': {
                'detail': {'type': 'string', 'example': 'the refresh token has been expired, please login again'}
            }
        }
    }
)
@api_view(['POST'])
def get_access_token(request):
    refresh_token = request.data.get('refresh',None)
    if not refresh_token:
        return Response('no refresh token was provided',400)
    token = RefreshToken(refresh_token)
    if token.check_exp():
        return Response({'detail':'the refresh token has been expired, please login again'},status=status.HTTP_408_REQUEST_TIMEOUT)
    access_token = str(token.access_token)
    return Response({'access_token': access_token}, status=status.HTTP_200_OK)