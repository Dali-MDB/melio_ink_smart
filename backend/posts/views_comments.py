from rest_framework.decorators import api_view
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from .permissions import PostPermission
from .serializers import CommentSerializer
from django.shortcuts import get_object_or_404
from .models import Post,Comment


class CommentListCreate(ListCreateAPIView):
    permission_classes = [PostPermission]
    serializer_class = CommentSerializer
    

    #for the permission class
    def get_object(self):
        post_id = self.kwargs.get('post_id')
        return get_object_or_404(Post, id=post_id)
    
    def perform_create(self, serializer):
        post = self.get_object()
        parent_comment_id = self.request.GET.get('parent_comment_id',None)
        #print(parent_comment_id,"\n"*10)
        if parent_comment_id:
            try:   #try fetching the parent comment
                parent_comment = get_object_or_404(Comment,id=parent_comment_id)
               # print("here",'\n'*10)
            except:  #set to None
                parent_comment = None
        else:
            parent_comment = None



        serializer.save(owner = self.request.user, parent_comment = parent_comment,post=post)

    def get_queryset(self):
        post = self.get_object()
        return Comment.objects.filter(post=post).order_by('-created_at')


class CommentRetrieveUpdateDelete(RetrieveUpdateDestroyAPIView):
    lookup_field = 'comment_id'
    serializer_class = CommentSerializer
    queryset = Comment.objects.all().order_by('-created_at')
    permission_classes = [PostPermission]

    def get_object(self):
        comment_id = self.kwargs.get('comment_id')
        return get_object_or_404(Comment, id=comment_id)
