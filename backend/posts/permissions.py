from rest_framework.permissions import BasePermission,SAFE_METHODS



class PostPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method  in SAFE_METHODS:
            return True
        else: 
            return request.user.is_authenticated
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and (request.user.is_staff or request.user.id == obj.owner.id):
            return True
        else:
            return False