from channels.routing import ProtocolTypeRouter, URLRouter
# import social_media.routing
from django.urls import re_path
from social_media.consumers import NotificationConsumer, TextRoomConsumer

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', TextRoomConsumer.as_asgi()),
    re_path(r'^ws/notification/(?P<user_id>[0-9]+)$', NotificationConsumer.as_asgi()),
]
