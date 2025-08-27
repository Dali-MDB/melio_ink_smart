from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User,related_name='profile',on_delete=models.CASCADE)
    pfp = models.ImageField(upload_to='users/',null=True,blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    age = models.IntegerField(null=True,blank=True)
    phone = models.CharField(max_length=20,null=True,blank=True)
    accept_notifications = models.BooleanField(default=True)

    def __str__(self):
        return f'profile: {self.user.email}'