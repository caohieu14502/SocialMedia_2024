from django.contrib import admin
from .models import Post, Tag


class PostAdmin(admin.ModelAdmin):
    list_display = ['pk', 'content']
    search_fields = ['content']
    list_filter = ['id', 'content']


admin.site.register(Post, PostAdmin)
admin.site.register(Tag)
