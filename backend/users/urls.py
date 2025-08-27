from django.urls import path,include
from . import authentication
from . import views

urlpatterns = [
    path('auth/register/',view=authentication.register),
    path('auth/login/',view=authentication.login),
    path('auth/access_token/',view=authentication.get_access_token),

    path('profile/me/',view=views.MyProfileViewUpdate.as_view()),
    path('profile/<int:user_id>/',view=views.view_profile),
    path('<int:user_id>/posts/',view=views.ListUserPosts.as_view()),
    path('current/',view=views.current_user_info),
   
]