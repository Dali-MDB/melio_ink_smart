from rest_framework.serializers import Serializer,ModelSerializer
from rest_framework import serializers
from .models import Post,Comment,Tag
from users.serializers import UserSerializer
from drf_spectacular.utils import extend_schema_field
from typing import List, Dict, Any

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
    sub_comments = serializers.SerializerMethodField()
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

    @extend_schema_field(List[Dict[str, Any]])
    def get_sub_comments(self, obj):
        children = obj.sub_comments.all().order_by('-created_at')
        return CommentSerializer(children, many=True).data



class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id','name']
