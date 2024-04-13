from datetime import datetime

from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.views import Response
from social_media.models import User, Post, Comment, Like, ReplyComment, UserFollowing, ChatGroup, UserGroupChat, Message
from social_media import serializers, paginators, perms
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.PostDetailSerializer
    pagination_class = paginators.PostPaginator

    def get_queryset(self):
        queries = self.queryset

        if not self.request.user.is_anonymous:
            uf = UserFollowing.objects.filter(follower=self.request.user)
            following = User.objects.filter(following__in=uf)
            queries.filter(user__in=following)

        kw = self.request.query_params.get("kw")
        if kw:
            queries = queries.filter(content__icontains=kw)

        tags = self.request.query_params.get("tags")
        if tags:
            queries = queries.filter(tags__name__icontains=tags)

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
            print(serializers.CommentSerializer(comments, many=True).data)

            return Response(serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)

        c = Comment.objects.create(user=request.user, post=self.get_object(), content=request.data.get('content'))
        return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['POST'], url_path='likes', detail=True)
    def like(self, request, pk):
        like, created = Like.objects.update_or_create(user=request.user, post=self.get_object())
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

        return Response(serializers.PostDetailSerializer(self.get_object(), context={'request': request}).data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action.__eq__('current_user'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], detail=False, url_name='current-user')
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request in ['Delete', 'Update']:
            return [perms.OwnerAuthenticated]
        return [permissions.AllowAny]

    @action(methods=['GET'], detail=True)
    def replies(self, request, pk):
        replies = self.get_object().reply_comment_set.filter(active=True).order_by('created_date')

        return Response(serializers.CommentSerializer(replies, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['POST'], url_path='replies', detail=True) #detail = True se co pk
    def add_replies(self, request, pk):
        c = ReplyComment.objects.create(user=request.user, comment=self.get_object(), content=request.data.get('content'))
        return Response(serializers.ReplyCommentSerializer(c).data, status=status.HTTP_201_CREATED)


class GroupChatViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveUpdateAPIView):
    queryset = ChatGroup.objects.all()
    serializer_class = serializers.ChatGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        groups = request.user.chat_groups.all()
        return Response(serializers.ChatGroupSerializer(groups, many=True).data)

    @action(methods=['GET', 'POST'], url_path='messages', detail=True) #detail = True se co pk
    def messages(self, request, pk):
        uc = UserGroupChat.objects.get(user=request.user, group=self.get_object())
        if request.method == 'GET':
            m = Message.objects.filter(user_group=uc)
            return Response(serializers.MessageSerializer(m, many=True).data)

        m = Message.objects.create(user_group=uc, content=request.data.get('content'))
        group = self.get_object()
        group.last_active = datetime.now()

        return Response(serializers.MessageSerializer(m).data, status=status.HTTP_201_CREATED)


class MessageViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = serializers.MessageSerializer
    permission_classes = [perms.OwnerAuthenticated]

