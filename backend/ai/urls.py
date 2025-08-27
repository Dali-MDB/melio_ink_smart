from django.urls import path,include
from . import views

urlpatterns = [
   path('post_tags/',view=views.get_tags_for_post),
   path('post_summary/',view=views.get_summary_for_post),
]