from django.contrib import admin
from story import models

class UserAdmin(admin.ModelAdmin):
    list_display = ["__str__"]

class ProfileAdmin(admin.ModelAdmin):
    list_display = ["__str__"]

class FollowAdmin(admin.ModelAdmin):
    list_display = ["__str__"]

class StoryAdmin(admin.ModelAdmin):
    list_display = ["__str__"]

class VoteAdmin(admin.ModelAdmin):
    list_display = ["__str__"]

class CommentAdmin(admin.ModelAdmin):
    list_display = ["__str__"]

admin.site.register(models.User, UserAdmin)
admin.site.register(models.Profile, ProfileAdmin)
admin.site.register(models.Follow, FollowAdmin)
admin.site.register(models.Story, StoryAdmin)
admin.site.register(models.Vote, VoteAdmin)
admin.site.register(models.Comment, CommentAdmin)