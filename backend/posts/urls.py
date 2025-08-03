from django.urls import path,include
from .views import PostsListCreate,PostRetrieveUpdateDelete


urlpatterns = [
   path('',PostsListCreate.as_view()),
   path('<int:post_id>/',PostRetrieveUpdateDelete.as_view()),
]