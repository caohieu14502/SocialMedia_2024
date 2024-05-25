from django.db.models import Count, Q
from social_media.models import User, Post, Comment, ReplyComment, PostMedia, Message, Notification, UserGroupChat, ChatGroup, UserFollowing
from rest_framework import serializers
from social_media_project.settings import CLOUDINARY_ROOT_URL


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField(method_name="get_avatar_url")

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'avatar', 'avatar_url']
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'id': {
                'read_only': True
            },
            'avatar': {
                'write_only': True
            },
        }

    def get_avatar_url(self, obj):
        if obj.avatar:
            return f"{CLOUDINARY_ROOT_URL}/{obj.avatar}"
        return ""

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data['password'])
        user.save()

        return user


class UserDetailSerializer(UserSerializer):
    followed = serializers.SerializerMethodField(read_only=True)
    total_followers = serializers.SerializerMethodField(read_only=True)
    total_followings = serializers.SerializerMethodField(read_only=True)
    total_posts = serializers.SerializerMethodField(read_only=True)

    def get_followed(self, user):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return UserFollowing.objects.filter(follower=request.user, following=user, active=True).exists()

    def get_total_posts(self, user):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return Post.objects.filter(user=request.user).count()

    def get_total_followers(self, user):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return UserFollowing.objects.filter(following=request.user).count()

    def get_total_followings(self, user):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return UserFollowing.objects.filter(follower=request.user).count()

    class Meta:
        model = UserSerializer.Meta.model
        fields = ['id', 'first_name', 'last_name', 'email', 'username',
                  'avatar_url', 'followed', 'cover', 'total_followers',
                  'total_posts', 'total_followings']


class PostMediaSerializer(serializers.ModelSerializer):
    full_url = serializers.SerializerMethodField()

    def get_full_url(self, obj):
        if obj.media_url and obj.post.media_type == "Images":
            return f"{CLOUDINARY_ROOT_URL}/{obj.media_url}"
        return CLOUDINARY_ROOT_URL

    class Meta:
        model = PostMedia
        fields = ['id', 'full_url', 'order', 'media_url']


class PostSerializer(serializers.ModelSerializer):
    post_media = PostMediaSerializer(many=True, source='post_media_set', read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.FileField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True
    )
    user = UserSerializer(required=False)

    class Meta:
        model = Post
        fields = ['id', 'content', 'user', 'created_date', 'media_type', 'uploaded_images', 'post_media', 'status']
        extra_kwargs = {
            'user': {
                'read_only': True
            },
        }

    def create(self, validated_data):
        data = validated_data.copy()
        print('get in')
        uploaded_data = data.pop('uploaded_images')
        print(uploaded_data)
        new_post = Post.objects.create(user=self.context["request"].user, **data)
        for index, uploaded_item in enumerate(uploaded_data):
            PostMedia.objects.create(post=new_post, media_url=uploaded_item, order=index)
        return new_post


class PostDetailSerializer(PostSerializer):
    liked = serializers.SerializerMethodField()
    count_likes = serializers.SerializerMethodField()
    count_comments = serializers.SerializerMethodField()

    def get_liked(self, post):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return post.like_set.filter(active=True, user=request.user).exists()

    def get_count_likes(self, post):
        return post.like_set.filter(active=True).count()

    def get_count_comments(self, post):
        return post.comment_set.filter(active=True).count()

    class Meta:
        model = PostSerializer.Meta.model
        fields = PostSerializer.Meta.fields + ['liked', 'count_likes', 'count_comments'
                                                  # 'media',
                                                  # 'watched'
                                                  ]
        extra_kwargs = PostSerializer.Meta.extra_kwargs


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    count_replies = serializers.SerializerMethodField(read_only=True)

    def get_count_replies(self, comment):
        return comment.replycomment_set.count()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'user', 'created_date', 'count_replies']


class ReplyCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ReplyComment
        fields = ['id', 'content', 'user', 'created_date']


class UserChatGroupSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField(method_name="get_avatar_url")

    def get_avatar_url(self, obj):
        if obj.avatar:
            return f"{CLOUDINARY_ROOT_URL}/{obj.avatar}"
        return ""

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar_url']


class ChatGroupSerializer(serializers.ModelSerializer):
    members_info = serializers.SerializerMethodField(read_only=True)
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), write_only=True)

    def get_members_info(self, group):
        ug = UserGroupChat.objects.filter(~Q(user=self.context["request"].user), group=group)
        return UserSerializer(ug.first().user).data

    class Meta:
        model = ChatGroup
        fields = ['id', 'name', 'members', 'last_active', 'members_info']

    def create(self, validated_data):
        data = validated_data.copy()
        group_set = ChatGroup.objects.filter(
            usergroupchat__user=data["members"][0], name=data["name"]
        ).filter(
            usergroupchat__user=data["members"][1]
        ).distinct()
        group = group_set.first()
        if not group:
            group = ChatGroup.objects.create(name=data["name"])
            UserGroupChat.objects.create(group=group, user=data["members"][0])
            UserGroupChat.objects.create(group=group, user=data["members"][1])
        return group


class UserGroupChatSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserGroupChat
        fields = ['group', 'user']
        extra_kwargs = {
            'group': {
                'read_only': True
            }
        }


class MessageSerializer(serializers.ModelSerializer):
    # user_group = UserGroupChatSerializer()
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        u = obj.user_group.user
        return UserSerializer(u).data

    class Meta:
        model = Message
        fields = ['id', 'content', 'user_group', 'created_date', 'user']


class PostNotiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'content']


class NotificationSerializer(serializers.ModelSerializer):
    post = PostNotiSerializer()

    class Meta:
        model = Notification
        fields = ['id', 'post', 'seen', 'count']

