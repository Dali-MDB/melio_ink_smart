from django.contrib import admin
from django.urls import path,include,re_path
from django.conf import settings
from django.conf.urls.static import static


from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/',include('users.urls')),
    path('posts/',include('posts.urls')),
    path('ai/',include('ai.urls')),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_spectacular.utils import extend_schema

@extend_schema(exclude=True)
@api_view(['GET','POST','PUT','PATCH','DELETE'])
def path_not_found(request, *args, **kwargs):
    return Response({
        "detail": "This endpoint does not exist.",
        "path": request.path
    }, status=404)



urlpatterns += [re_path(r"^(?P<path>.*)$",path_not_found )]
