# Generated by Django 5.0.3 on 2024-05-15 13:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("social_media", "0013_comment_status_post_status_replycomment_status"),
    ]

    operations = [
        migrations.RenameField(
            model_name="notification",
            old_name="user",
            new_name="post",
        ),
        migrations.AddField(
            model_name="notification",
            name="count",
            field=models.IntegerField(default=0),
        ),
    ]
