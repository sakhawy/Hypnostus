from rest_framework import serializers
from story import models 
from itertools import chain

class UserSerializer(serializers.ModelSerializer):
    # FIXME: DONT"T GIVE AWAY THE PASSWORD IN GET REQUESTS.
    class Meta:
        model = models.User
        fields = ["id", "username", "password"]

    def create(self, validated_data):
        user = models.User(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField("get_username")
    followers = serializers.SerializerMethodField("get_followers")
    following = serializers.SerializerMethodField("get_following")
    is_followed = serializers.SerializerMethodField("get_is_followed")

    def get_username(self, profile):
        return profile.user.username

    def get_followers(self, profile):
        return len(profile.followers.all())

    def get_following(self, profile):
        return len(models.Follow.objects.filter(profile=profile))

    def get_is_followed(self, profile):
        "Check if the requeted profile is followed by the requeting."
        try:
            requesting_profile = self.context["profile"]
        except:
            # anon profile 
            print("NO CONTEXT")
            return 0
        
        requesting_profile_followings = models.Follow.objects.filter(profile=requesting_profile)

        for follow in requesting_profile_followings:
            # if the requested profile in the requesting profile followings list
            if follow.following == profile:
                # is following
                return 1
        # is not following
        return 0        

    class Meta:
        model = models.Profile
        # the "profile_follow" field is an indicator for knowing whether the visited profile is followed- 
        # by the requesting user of not.
        fields = ["id", "user", "username", "followers", "following", "is_followed"] 

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
                for vote in user.votes.all():
                    if story == vote.entity:
                        return vote.value
                return 0
        return None

    def get_username(self, story):
        return story.user.username

    def get_upvotes(self, story):
        return len(list(
            filter(
                lambda vote: vote.value == 1,   # get upvotes
                story.votes.all()
            )
        ))

    def get_downvotes(self, story):
        return len(list(
            filter(
                lambda vote: vote.value == -1,  # get downvotes
                story.votes.all()
            )
        ))

    class Meta:
        model = models.Story
        fields = ["id", "title", "content", "parent", "user", "children_values", "upvotes", "downvotes", "username", "user_vote", "n"]


class VoteSerializer(serializers.ModelSerializer):
    # FIXME: (LATER) I SPENT LIKE 1 FUCKING HOUR ON THIS LITTLE SHIT
    # the problem was with the entity field
 
    entity = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Vote
        fields = ["id", "user", "entity", "value"]

    def create(self, validated_data):
        "Create new vote or change the value of an existing one."
        entity_types_dict = {
            'story': {
                'model': models.Story, 
                # 'serializer': serializers.StorySerializer
            },
            'comment': {
                "model":models.Comment,
                # "serializer": serializers.CommentSerializer
            }}
        entity_model = entity_types_dict[self.context["entity_type"]]["model"]
        try:
            entity = entity_model.objects.get(id=self.context["entity"])
        except:
            return False

        user = validated_data["user"]

        value = validated_data["value"]
        vote, created = models.Vote.change_or_create(user=user, entity=entity, value=value)
        return vote

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField("get_username")
    user_vote = serializers.SerializerMethodField("get_user_vote")

    def get_username(self, comment):
        return comment.user.username
    
    def get_user_vote(self, story):
        if self.context:
            user = self.context.get("user")
            if user.is_authenticated:
                for vote in user.votes.all():
                    if story == vote.entity:
                        return vote.value
                return 0
        # the context is defined in the get, when not provided the user is the creator 
        return 0    # will be zero since it was just created

    class Meta:
        model = models.Comment
        fields = ["id", "story", "content", "user", "parent", "value", "username", "user_vote"]
