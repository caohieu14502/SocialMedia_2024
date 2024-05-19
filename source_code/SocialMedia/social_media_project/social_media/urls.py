from django.urls import path, include
from rest_framework import routers
from social_media import views

routers = routers.DefaultRouter()
routers.register('posts', views.PostViewSet, basename='posts')
routers.register('users', views.UserViewSet, basename='users')
routers.register('comments', views.CommentViewSet, basename='comments')
routers.register('group-chats', views.GroupChatViewSet, basename='group-chats')
routers.register('messages', views.MessageViewSet, basename='messages')
routers.register('notifies', views.NotificationViewSet, basename='notifies')

urlpatterns = [
    path('', include(routers.urls)),
]