# Generated by Django 5.0.3 on 2024-05-02 15:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("social_media", "0010_alter_post_media_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="postmedia",
            name="post",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="post_media_set",
                to="social_media.post",
            ),
        ),
    ]