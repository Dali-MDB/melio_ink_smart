from rest_framework.serializers import Serializer,ModelSerializer
from .models import Post,Comment
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



class CommentSerializer(ModelSerializer):
    #sub_comments = CommentSerializer(many=True)
    class Meta:
        model = Comment
        fields = ['id','owner' ,'post' ,'content' ,'created_at' ,'sub_comments','parent_comment']
        extra_kwargs = {
            'owner' : {'read_only' : True},
            'created_at' : {'read_only' : True},
            'sub_comments' : {'read_only' : True},
            'parent_comment' : {'read_only' : True},
            'post' : {'read_only' : True}
        }

