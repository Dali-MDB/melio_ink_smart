from django.urls import path,include
from .views_posts import PostsListCreate,PostRetrieveUpdateDelete,PostImage
from .views_likes import like_post,get_all_likes
from .views_comments import CommentListCreate,CommentRetrieveUpdateDelete
from .views_tags import TagsListCreate,TagsViewUpdateDelete,tagsBulkCreate


urlpatterns = [
   path('',PostsListCreate.as_view()),
   path('<int:post_id>/',PostRetrieveUpdateDelete.as_view()),
   path('<int:post_id>/image/',PostImage.as_view()),

   path('<int:post_id>/like/',like_post),
   path('<int:post_id>/all_likes/',get_all_likes),

   path('<int:post_id>/comments/',CommentListCreate.as_view()),
   path('<int:post_id>/comments/<int:comment_id>/',CommentRetrieveUpdateDelete.as_view()),

   path('tags/',TagsListCreate.as_view()),
   path('tags/<int:id>/',TagsViewUpdateDelete.as_view()),
   path('tags/bulk/',tagsBulkCreate)
]