from rest_framework.serializers import Serializer,ModelSerializer
from rest_framework import serializers
from .models import Post,Comment,Tag
from users.serializers import UserSerializer
from drf_spectacular.utils import extend_schema_field
from typing import List, Dict, Any


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id','name']

class PostSerializer(ModelSerializer):
    owner = UserSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    likes_count = serializers.ReadOnlyField()
    comments_count = serializers.ReadOnlyField()
    tags = TagSerializer(many=True,read_only=True)
    
    class Meta:
        model = Post
        fields = ['id','owner','title','content','image','tags','summary','created_at','status','is_liked','is_saved','likes_count','comments_count','owner']
        extra_kwargs = {
            'created_at' : {'read_only' : True},
            'image' : {'read_only' : True},
            'summary' : {'read_only' : True},
            'status' : {'read_only' : True},
            'owner' : {'read_only' : True},
            'tags' : {'read_only' : True}
        }

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            post.tags.add(tag)
        return post

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.savers.filter(id=request.user.id).exists()
        return False



class CommentSerializer(ModelSerializer):
    sub_comments = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id','owner' ,'post' ,'content' ,'created_at' ,'sub_comments','parent_comment','is_liked','likes_count']
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

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
    
    def get_likes_count(self, obj):
        return obj.likes.count()



