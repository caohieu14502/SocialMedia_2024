import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class NotificationConsumer(WebsocketConsumer):
    # ws nay dùng chung user id hết để làm url
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["user_id"]
        self.room_group_name = f"notify_{self.room_name}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
            # Add Channel của instance này đi vào cái group mình tạo ở trên
        )

        self.accept()

        print(f"{self.scope['user'].username} connected")

        self.send(text_data=json.dumps({
            'type': 'connect_success',
            'message': 'Connection has been successfully established!'
        }))

        # url = ws/notification/{post.user_id}
        # if self.request.user ==  post.user_id
        # -> create, add to group post_owner

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        user = self.scope["user"]
        if user.pk != self.room_name:
            text_data_json = json.loads(text_data)
            message = text_data_json["message"]

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, { "type": "notify_message", "message": user.first_name + message }
            )

    def notify_message(self, event):
        message = event["message"]
        print(message)

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            "type":"notify",
            "message": message,
        }))


class TextRoomConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        text = text_data_json['message']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, { 'type': 'chat_message', 'message': text}
        )

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            "type": "chat",
            "message": message,
        }))