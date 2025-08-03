from rest_framework.serializers import Serializer,ModelSerializer
from django.contrib.auth.models import User





class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','username','password','first_name','last_name']
        extra_kwargs = {
                'password': {'write_only': True}
            }