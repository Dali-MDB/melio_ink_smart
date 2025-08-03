from rest_framework.serializers import Serializer,ModelSerializer
from .models import Post
from users.serializers import UserSerializer

class PostSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = ['id','owner','title','content','image','tags','summary','created_at','status']
        extra_kwargs = {
            'owner' : {'read_only' : True},
            'created_at' : {'read_only' : True},
            'image' : {'read_only' : True},
            'summary' : {'read_only' : True},
            'status' : {'read_only' : True}

        }

