from social_media.models import User, Post, Comment, ReplyComment, PostMedia, Message, UserGroupChat, ChatGroup
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


class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = ['id', 'media_type', 'media_url']


class PostSerializer(serializers.ModelSerializer):
    post_media_set = PostMediaSerializer(many=True)
    user = UserSerializer()

    class Meta:
        model = Post
        fields = ['id', 'content', 'user', 'created_date']
        extra_kwargs = {
            'user': {
                'read_only': True
            }
        }

    def create(self, validated_data):
        data = validated_data.copy()

        post = Post(user=self.context["request"].user, **data)
        post.save()

        return post


class PostDetailSerializer(PostSerializer):
    liked = serializers.SerializerMethodField()

    def get_liked(self, post):
        request = self.context.get('request')
        if request.user.is_authenticated:
            return post.like_set.filter(active=True).exists()

    class Meta:
        model = PostSerializer.Meta.model
        fields = PostSerializer.Meta.fields + ['liked',
                                                  # 'media',
                                                  # 'watched'
                                                  ]
        extra_kwargs = PostSerializer.Meta.extra_kwargs


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'user', 'created_date']


class ReplyCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ReplyComment
        fields = ['id', 'content', 'user', 'created_date']


class ChatGroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True)

    class Meta:
        model = ChatGroup
        fields = ['id', 'name', 'members', 'last_active']


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