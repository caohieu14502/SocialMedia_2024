# Generated by Django 5.0.3 on 2024-04-29 14:13

import cloudinary.models
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("social_media", "0008_alter_postmedia_options_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="postmedia",
            name="media_url",
            field=cloudinary.models.CloudinaryField(
                max_length=255, verbose_name="media_url"
            ),
        ),
        migrations.AlterField(
            model_name="postmedia",
            name="order",
            field=models.SmallIntegerField(),
        ),
    ]
