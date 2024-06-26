from datetime import datetime
from django.db.models import Q
from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.views import Response
from social_media.models import User, Post, Comment, Like, ReplyComment, UserFollowing, Notification, ChatGroup, UserGroupChat, Message, PostMedia
from social_media import serializers, paginators, perms
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.PostDetailSerializer
    pagination_class = paginators.PostPaginator
    parser_classes = (parsers.MultiPartParser,)

    def get_queryset(self):
        queries = self.queryset

        kw = self.request.query_params.get("kw")
        status = self.request.query_params.get("status")
        if status and self.request.user.is_superuser:
            queries = queries.filter(status__isnull=False)
            return queries

        if kw:
            queries = queries.filter(Q(content__icontains=kw) | Q(tags__name__icontains=kw))
        elif self.action == 'list':
            uf = UserFollowing.objects.filter(follower=self.request.user)
            following = User.objects.filter(following__in=uf)
            queries = queries.filter(Q(user__in=following) | Q(user=self.request.user))

        return queries

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            return [permissions.AllowAny()]
        elif self.action in ['update', 'destroy', 'partial_update']:
            return [perms.OwnerAuthenticated()]

        return [permissions.IsAuthenticated()]

    @action(methods=['POST', 'GET'], url_path='comments', detail=True) #detail = True se co pk
    def add_comment(self, request, pk):
        if request.method == 'GET':
            comments = self.get_object().comment_set.filter(active=True)

            return Response(serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)
        print(request.data)
        c = Comment.objects.create(user=request.user, post=self.get_object(), content=request.data['content'])
        return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['POST'], url_path='likes', detail=True)
    def like(self, request, pk):
        like, like_created = Like.objects.update_or_create(user=request.user, post=self.get_object())
        like.active = not like.active

        if like.active:
            channel_layer = get_channel_layer()
            message = {
                "content": f'{request.user.username} has like your post',
                "user": request.user.username
            }
            async_to_sync(channel_layer.group_send)(f"notify_{self.get_object().user.id}", {
                "type": "notify_message",
                "message": message})
        like.save()
        likes_count = Like.objects.filter(post=self.get_object(), active=True).distinct().count()
        comments_count = Comment.objects.filter(post=self.get_object()).distinct().count()
        noti, noti_created = Notification.objects.update_or_create(post=self.get_object()) # set seen ỗi lần chủ bài viết đi vào xem bài viết đó        if like.active:
        noti.count = likes_count + comments_count
        noti.seen = False
        noti.save()

        return Response(serializers.PostDetailSerializer(self.get_object(), context={'request': request}).data, status=status.HTTP_200_OK)

    @action(methods=['POST'], url_path='report', detail=True)
    def report(self, request, pk):
        p = self.get_object()
        try:
            p.status = request.data['status']
        except:
            if request.user.is_superuser:
                if request.data['desc'] == 'Del':
                    p.active = False
                elif request.data['desc'] == 'Skip':
                    p.status = None
        p.save()
        return Response(status=status.HTTP_200_OK)


class UserViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.PostPaginator
    parser_classes = [parsers.MultiPartParser]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queries = self.queryset

        kw = self.request.query_params.get("kw")
        if kw:
            queries = queries.filter(Q(username__icontains=kw) |
                                     Q(last_name__icontains=kw) |
                                     Q(first_name__icontains=kw)
                                     )

        return queries

    def retrieve(self, request, *args, **kwargs):
        return Response(serializers.UserDetailSerializer(self.get_object(), context={'request': request}).data)

    @action(methods=['get'], detail=False, url_name='current-user')
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)

    @action(methods=['post'], detail=True)
    def follow(self, request, pk):
        follow, created = UserFollowing.objects.update_or_create(follower=request.user, following=self.get_object())
        follow.active = not follow.active
        follow.save()
        return Response(status=status.HTTP_200_OK)

    @action(methods=['get'], detail=True, url_path='posts')
    def user_posts(self, request, pk):
        posts = Post.objects.filter(user=self.get_object())
        return Response(serializers.PostDetailSerializer(posts, many=True, context={'request': request}).data, )


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request in ['delete', 'update', 'partial_update']:
            return [perms.OwnerAuthenticated()]
        return [permissions.IsAuthenticated()]

    @action(methods=['GET', 'POST'], url_path='replies', detail=True)
    def replies(self, request, pk):
        if request.method == 'GET':
            replies = self.get_object().replycomment_set.filter(active=True).order_by('created_date')

            return Response(serializers.ReplyCommentSerializer(replies, many=True).data, status=status.HTTP_200_OK)
        c = ReplyComment.objects.create(user=request.user, parent=self.get_object(), content=request.data.get('content'))
        return Response(serializers.ReplyCommentSerializer(c).data, status=status.HTTP_201_CREATED)


class GroupChatViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveUpdateAPIView):
    queryset = ChatGroup.objects.all()
    serializer_class = serializers.ChatGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        groups = request.user.chat_groups.all()
        return Response(serializers.ChatGroupSerializer(groups, many=True, context={"request":request}).data)

    @action(methods=['GET', 'POST'], url_path='messages', detail=True) #detail = True se co pk
    def messages(self, request, pk):
        uc = UserGroupChat.objects.get(user=request.user, group=self.get_object())
        if request.method == 'GET':
            m = Message.objects.filter(user_group__group=self.get_object())
            return Response(serializers.MessageSerializer(m, many=True).data)

        m = Message.objects.create(user_group=uc, content=request.data.get('content'))
        group = self.get_object()
        group.last_active = datetime.now()

        channel_layer = get_channel_layer()
        message = serializers.MessageSerializer(m).data
        async_to_sync(channel_layer.group_send)(f"chat_{self.get_object().id}", {
            'type': 'chat_message',
            'message': message}
        )

        return Response(message, status=status.HTTP_201_CREATED)


class MessageViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = serializers.MessageSerializer
    permission_classes = [perms.OwnerAuthenticated]


class NotificationViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = serializers.NotificationSerializer

    def get_queryset(self):
        return self.queryset.filter(post__user__id=self.request.user.id)