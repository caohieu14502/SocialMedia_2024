from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    avatar = CloudinaryField('avatar')
    cover = CloudinaryField('cover') # ảnh bia
    chat_groups = models.ManyToManyField('ChatGroup', through='UserGroupChat')


class UserFollowing(models.Model): #bang trung gian
    follower = models.ForeignKey("User", related_name="follower", on_delete=models.CASCADE)
    following = models.ForeignKey("User", related_name="following", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=False)

    class Meta:
        unique_together = ('follower', 'following')


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    update_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['-created_date']


class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)


class Post(BaseModel):
    content = models.TextField(max_length=1000, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    media_type = models.CharField(max_length=100, null=False, default="Images") #'Images' or 'Video'
    status = models.CharField(null=True, max_length=50)
    tags = models.ManyToManyField('Tag')

    def __str__(self):
        return self.content


class PostMedia(BaseModel):
    media_url = CloudinaryField('media_url', resource_type="auto",)
    order = models.SmallIntegerField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_media_set')

    def __str__(self):
        return self.media_url

    class Meta:
        unique_together = ('order', 'post')


class Interaction(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)

    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.CharField(null=False, max_length=255)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=False)
    status = models.CharField(null=True, max_length=50)



class ReplyComment(Interaction):
    content = models.TextField(null=False)
    parent = models.ForeignKey(Comment, on_delete=models.CASCADE, null=False)
    status = models.CharField(null=True, max_length=50)


class Like(Interaction):
    type = models.SmallIntegerField(default=0) # Like, Yeu thich, Sad, haha
    active = models.BooleanField(default=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=False)

    class Meta:
        unique_together = ('user', 'post')


class Notification(BaseModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=False)
    count = models.IntegerField(default=0)
    content = models.CharField(max_length=100)
    

class ChatGroup(models.Model):
    name = models.CharField(max_length=100, default='Duo')
    members = models.ManyToManyField(User, through='UserGroupChat')
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class UserGroupChat(models.Model):
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Message(BaseModel):
    content = models.TextField()
    user_group = models.ForeignKey(UserGroupChat, on_delete=models.CASCADE)

    def __str__(self):
        return self.content

    class Meta:
        ordering = ['created_date']
