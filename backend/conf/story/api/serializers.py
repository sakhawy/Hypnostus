from rest_framework import serializers
from story import models 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ["id", "username", "password"]

    def create(self, validated_data):
        user = models.User(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        return user


class StorySerializer(serializers.ModelSerializer):
    upvotes = serializers.SerializerMethodField("get_upvotes")
    downvotes = serializers.SerializerMethodField("get_downvotes")

    def get_upvotes(self, story):
        return len(story.upvotes.all())

    def get_downvotes(self, story):
        return len(story.downvotes.all())

    class Meta:
        model = models.Story
        fields = ["id", "name", "content", "parent", "user", "upvotes", "downvotes"]

class VoteSerializer(serializers.ModelSerializer):
    # TODO: fix the clusterfuck of a model i built here ==> ( id, user, story, value )
    class Meta:
        model = models.Vote
        fields = ["id", "user", "upvoted_story", "downvoted_story"]

    # TODO: override is_valid to catch the cloned votes errors