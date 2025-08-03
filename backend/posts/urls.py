from django.urls import path,include
from .views_posts import PostsListCreate,PostRetrieveUpdateDelete,PostImage
from .views_likes import like_post,get_all_likes
from .views_comments import CommentListCreate


urlpatterns = [
   path('',PostsListCreate.as_view()),
   path('<int:post_id>/',PostRetrieveUpdateDelete.as_view()),
   path('<int:post_id>/image/',PostImage.as_view()),

   path('<int:post_id>/like/',like_post),
   path('<int:post_id>/all_likes/',get_all_likes),

   path('<int:post_id>/comments/',CommentListCreate.as_view()),
]