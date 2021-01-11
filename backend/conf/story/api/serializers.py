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
    username = serializers.SerializerMethodField("get_username")
    user_vote = serializers.SerializerMethodField("get_user_vote")
    n = serializers.SerializerMethodField("get_n")


    def get_n(self, story):
        # get the rank from parent's ordered dict
        if not story.parent:
            return 0
        
        children = models.Story.to_obj(story.parent.children_values)
        
        # there's a bug that i don't understand here so i just try catched it
        try:
            n = list(children.keys()).index(str(story.id))
            return n
        except:
            return None

    def get_user_vote(self, story):
        if self.context:
            user = self.context.get("user")
            if user.is_authenticated:
                for vote in user.vote_set.all():
                    if story == vote.upvoted_story:
                        return 1
                    elif story == vote.downvoted_story:
                        return -1
                return 0
        return None

    def get_username(self, story):
        return story.user.username

    def get_upvotes(self, story):
        return len(story.upvotes.all())

    def get_downvotes(self, story):
        return len(story.downvotes.all())

    class Meta:
        model = models.Story
        fields = ["id", "title", "content", "parent", "user", "children_values", "upvotes", "downvotes", "username", "user_vote", "n"]

class VoteSerializer(serializers.ModelSerializer):
    # TODO: fix the clusterfuck of a model i built here ==> ( id, user, story, value )
    class Meta:
        model = models.Vote
        fields = ["id", "user", "upvoted_story", "downvoted_story"]

    # TODO: override is_valid to catch the cloned votes errors