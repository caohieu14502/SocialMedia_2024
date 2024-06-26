# Generated by Django 5.0.3 on 2024-04-17 15:34

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("social_media", "0004_user_chat_groups"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="message",
            options={"ordering": ["created_date"]},
        ),
        migrations.AddField(
            model_name="userfollowing",
            name="active",
            field=models.BooleanField(default=False),
        ),
    ]
