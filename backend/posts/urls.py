from django.urls import path,include
from .views import PostsListCreate,PostRetrieveUpdateDelete,PostImage


urlpatterns = [
   path('',PostsListCreate.as_view()),
   path('<int:post_id>/',PostRetrieveUpdateDelete.as_view()),
   path('<int:post_id>/image/',PostImage.as_view()),
]