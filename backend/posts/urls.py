from django.urls import path,include
from .views_posts import PostsListCreate,PostRetrieveUpdateDelete,PostImage, save_post, get_saved_posts, publish_draft
from .views_likes import like_post,get_all_likes
from .views_comments import CommentListCreate,CommentRetrieveUpdateDelete,UserComments,LikeComment
from .views_tags import TagsListCreate,TagsViewUpdateDelete,tagsBulkCreate
from .statistics_views import get_post_statistics,get_user_statistics


urlpatterns = [
   path('',PostsListCreate.as_view()),
   path('<int:post_id>/',PostRetrieveUpdateDelete.as_view()),
   path('<int:post_id>/image/',PostImage.as_view()),
   path('<int:post_id>/publish/',publish_draft),

   path('<int:post_id>/like/',like_post),
   path('<int:post_id>/all_likes/',get_all_likes),
   path('saved_posts/',get_saved_posts),
   path('save_post/',save_post),

   path('<int:post_id>/comments/',CommentListCreate.as_view()),
   path('<int:post_id>/comments/<int:comment_id>/',CommentRetrieveUpdateDelete.as_view()),
   path('<int:post_id>/comments/<int:comment_id>/like/',LikeComment.as_view()),
   
   path('user_comments/',UserComments.as_view()),
   path('tags/',TagsListCreate.as_view()),
   path('tags/<int:id>/',TagsViewUpdateDelete.as_view()),
   path('tags/bulk/',tagsBulkCreate),

   path('statistics/post_stats/<int:post_id>/',get_post_statistics),
   path('statistics/',get_user_statistics),
]