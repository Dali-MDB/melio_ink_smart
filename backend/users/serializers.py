from rest_framework.serializers import Serializer,ModelSerializer
from django.contrib.auth.models import User
from .models import Profile
from rest_framework import serializers



class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','username','password','first_name','last_name']
        extra_kwargs = {
                'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        #we don't allow to update email and password (they have specific end points with mail confirmation)
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        return super().update(instance, validated_data)
    
class ProfileSerializer(ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Profile
        fields = ['id','user','pfp','first_name','last_name','age','phone','accept_notifications']


    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user_ser = UserSerializer(data=user_data)
        
        if user_ser.is_valid():
            user = user_ser.save()
            profile = Profile.objects.create(**validated_data,user = user)
            return profile
        else:
            raise serializers.ValidationError(user_ser.errors)

    def update(self, instance, validated_data):
        #we don't want to change the user field
        user_data = validated_data.pop('user',None)
        if user_data:
            user_ser = UserSerializer(instance.user,data=user_data,partial=True)
            user_ser.is_valid(raise_exception=True)
            user_ser.save()

        for key,value in validated_data.items():
            setattr(instance,key,value)
        instance.save()
        return instance
        
