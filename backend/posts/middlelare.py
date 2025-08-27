import re
from .models import Post,PostView

class BlogMiddleWare:
    def __init__(self,get_response):
        self.get_response = get_response

    def __call__(self, request):
        respone = self.get_response(request)
        path = request.path
        if request.status == 200 and request.method == 'GET' and self.verify_path(path):
            post_id = request.resolver_match.kwargs.get("pk")
            if  post_id:
                post = Post.objects.filter(pk=post_id).first()
                if post:
                    PostView.objects.create( 
                        post=post,
                        viewer=request.user if request.user.is_authenticated else None,
                        ip_address=self.get_client_ip(request),
                        user_agent=request.META.get("HTTP_USER_AGENT", ""),
                        referrer=request.META.get("HTTP_REFERER", ""),
                    )

        return respone  #gg



    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0]
        return request.META.get("REMOTE_ADDR")
    
    def verify_path(path:str)->bool:
        idk = re.search(r'/posts/(\d+)/$',path)
        return True if idk else False
        