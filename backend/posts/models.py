from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Tag(models.Model):
    name = models.CharField(max_length=50,unique=True)

    def __str__(self):
        return self.name
    


class Post(models.Model):
    owner = models.ForeignKey(User,related_name='posts',on_delete=models.CASCADE)
    title = models.CharField(max_length=256)
    content = models.TextField()
    image = models.ImageField(upload_to='post_images',null=True,blank=True)
    tags = models.ManyToManyField(Tag,related_name='posts')
    summary = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    STATUS_CHOICES = [
        ('DRAFT','DRAFT'),
        ('PUBLISHED','PUBLISHED')
    ]
    savers = models.ManyToManyField(User,related_name='saved_posts',blank=True)
    status = models.CharField(choices=STATUS_CHOICES,null=True,blank=True,default='DRAFT')   #used later for drafts and validation


    @property
    def comments_count(self):
        return self.comments.count()
    
    @property 
    def likes_count(self):
        return self.likes.count()


class Comment(models.Model):
    owner = models.ForeignKey(User,related_name='comments',on_delete=models.CASCADE)
    post = models.ForeignKey(Post,related_name='comments',on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent_comment = models.ForeignKey('self',related_name='sub_comments',on_delete=models.CASCADE,null=True,blank=True)
    likes = models.ManyToManyField(User,related_name='liked_comments')



class Like(models.Model):
    user = models.ForeignKey(User,related_name='likes',on_delete=models.CASCADE)
    post = models.ForeignKey(Post,related_name='likes',on_delete=models.CASCADE)
    time_stamp = models.DateTimeField(auto_now_add=True)



class PostView(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="views")
    viewer = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"View of {self.post.title} at {self.timestamp}"


class CommentLike(models.Model):
    user = models.ForeignKey(User,related_name='comment_likes',on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment,related_name='comment_likes',on_delete=models.CASCADE)
    time_stamp = models.DateTimeField(auto_now_add=True)
