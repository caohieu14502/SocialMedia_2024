# Generated by Django 5.0.3 on 2024-04-07 14:21

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "social_media",
            "0002_alter_comment_created_date_alter_comment_update_date_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="comment",
            name="content",
            field=models.CharField(max_length=255),
        ),
    ]
