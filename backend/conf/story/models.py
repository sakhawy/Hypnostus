from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.fields import GenericRelation  
from django.contrib.contenttypes.models import ContentType
from django.utils.timezone import now
from mptt.models import MPTTModel, TreeForeignKey
import json

class User(AbstractUser):
    def __str__(self):
        return self.username

    def __repr__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    created = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.user.username

    def __repr__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        if not self.id:
            self.created = now()
        super().save(*args, **kwargs)

class Follow(models.Model):
    # TODO: user can't follow self.
    # TODO: follows are unique

    @staticmethod
    def follow(profile, following):
        # since we're blind, we'll search for a follow, if it exist, delete it, otherwise, create a new one.
        for follower in following.followers.all():
            if follower.profile == profile:
                # delete follow
                follower.delete()
                return False
        Follow.objects.create(profile=profile, following=following)
        return True
    
    "Like the Vote model, this will link a source with a destination."
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    following = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="followers")
    created = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.profile} > {self.following}"

    def __repr__(self):
        return f"{self.profile} > {self.following}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.created = now()
        super().save(*args, **kwargs)


class Vote(models.Model):
    @staticmethod
    def change_or_create(user, entity, value):
        "Create new vote or change the value of an existing one."
        # get
        for vote in user.votes.all():
            if vote.entity == entity:
                # remove duplicates
                if vote.value == value:
                    vote.delete()
                # change value
                else:
                    vote.value = value
                    vote.save()
            
                entity.vote()  # call vote to change values
                return vote, False
            
        #create
        else:
            vote = Vote(user=user, entity=entity, value=value)
            vote.save()
            entity.vote()  # call vote to change values
            return vote, True

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="votes")
    entity = GenericForeignKey("content_type", "object_id")
    value = models.IntegerField()

    created = models.DateTimeField(blank=True, null=True)
                    
    def __str__(self):
        return f"{self.entity}: {self.value}"

    def __repr__(self):
        return f"{self.entity}: {self.value}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.created = now()
        super().save(*args, **kwargs)


class Story(MPTTModel):
    """
    So, the value will look something like this 
    {self_id: value, child_1_id: value, child_2_id: value ... }
    GOAL: Least possible db queries.
    """
    # TODO: Update children_values when delete (somehow i forgot to add that :))
    # TODO: When 2 branches have the save values, chose the one with the most nodes
    @staticmethod
    def get_nth_child(story, n):
        """
        Trying this different design where I only have to get the next best child.
        Return the id of the nth best child.
        This design will be temporal till i implement a websocket functionality.
        My initial goal was to move the computational burden from the server to the client
        by sending whole branches at once instead of getting fucked by a million client request.  
        """
        children = Story.to_obj(story.children_values)
        try:
            return Story.objects.get(id=list(children.keys())[n])

        except:
            raise Exception("Can't Get Child")
    
    @staticmethod
    def get_nth_path(story, n):
        """
        The way I see this right now is to make a dict of descendants then go in a chain
        of finding the next max childnode after getting the first nth best immediate child. 
        """
        children_values = Story.to_obj(story.children_values)
        descendants = {key.id: key for key in story.get_descendants()}  # descendants dict 
        path = {}
        if story.children_values:   # when no children
            nth_id = int(list(Story.to_obj(story.children_values).items())[n][0])

            # so instead of quering if the story is a leaf node or not,
            # the children_value field has the ids of the children from which we can detect a leaf node
            path[nth_id] = descendants[nth_id]
            current_story = path[nth_id]
            while len(Story.to_obj(current_story.children_values)) > 0: 
                next_id = int(list(Story.to_obj(current_story.children_values).items())[0][0]) # get id from value field
                stry = descendants[next_id]    # get story from descendants
                path[next_id] = stry   # insert it to path
                current_story = stry

        return path

    @staticmethod
    def to_obj(json_data):
        if json_data:
            data = json.loads(json_data)
        else:
            data = {}
        return data

    @staticmethod
    def get_max_children_values(json_data):
        data = Story.to_obj(json_data)
        if data:
            return list(data.items())[0][1]
        return 0 


    @staticmethod
    def added_value(json_data, target, value):
        "Helper function for returning json object after changing a value / creating a new item"
        data = Story.to_obj(json_data)
        
        data[target] = value

        # sort the dictionary 
        sorted_dict = dict(sorted(data.items(), key=lambda item: item[1], reverse=True)) # sort the items ==> dict_items((key, value)) by the value ==> item[1] 
        return json.dumps(sorted_dict)  # python3.6+'s dict is sorted by insertion
    
    def vote(self):
        """
        This function updates the values of a node and its ancestors.
        It assigns the value of the node's upvotes plus its maximum children values to its parent.
        And does the same with the node's parent, and so on till root.
        """
        value = sum([vote.value for vote in self.votes.all()])   # upvotes(1) + downvotes(-1)

        ancestors = self.get_ancestors(ascending=True)
        self.value = value
        child_story = self
        for anc_story in ancestors:
            # change the value of the child_story in parent
            anc_story.children_values = Story.added_value(anc_story.children_values, str(child_story.id), value)

            # update the child_story and value to be of the parent -for the next parent-
            child_story = anc_story
            value = sum([vote.value for vote in child_story.votes.all()])
            # save the new value to the parent
            anc_story.value = value

        Story.objects.bulk_update(list(ancestors)+[self], ['children_values', 'value'])


    @staticmethod
    def default_value(story):
        "Will be called in save -after story gets saved- to initialize the stoy in its parent."
        anc = story.get_ancestors(ascending=True)
        if anc:
            parent = anc[0]
            parent.children_values = Story.added_value(parent.children_values, story.id, 0) # add child to parent's children_values field
            parent.save()

    title = models.CharField(max_length=500)
    content = models.TextField()
    parent = TreeForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name="children")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    children_values = models.JSONField(blank=True, null=True)
    value = models.IntegerField()

    votes = GenericRelation(Vote)   # reverse relation for vote contenttype

    created = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} #{self.id}"

    def __repr__(self):
        return self.title

    def save(self, *args, **kwargs):
        # ok, this took me some time
        # i've overridden save many times but this one is different since i need an id first
        if not self.id:
            self.created = now()

            super().save(*args, **kwargs) 
            Story.default_value(self)
        else:
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # FIXME: I think this is bad. signals are better, fix later
        parents = self.get_ancestors(ascending=True)
        if parents:
            parent = parents[0]
            children = Story.to_obj(parent.children_values)
            children.pop(str(self.id), None)
            parent.children_values = json.dumps(children)
            parent.save()
        super().delete(*args, **kwargs)

class Comment(MPTTModel):
    story = models.ForeignKey(Story, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    parent = TreeForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name="children")
    value = models.IntegerField(default=0)

    votes = GenericRelation(Vote)   # reverse relation for vote contenttype

    created = models.DateTimeField(blank=True, null=True)

    def vote(self):
        "Update the value."
        print(f"INVOKED {self.value} {len(self.votes.all())}")
        print(Vote.objects.all())
        self.value = sum([vote.value for vote in self.votes.all()])
        self.save()

    def __str__(self):
        return f"Comment #{self.id} for {self.story}"

    def __repr__(self):
        return f"Comment #{self.id} for {self.story}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.created = now()
        super().save(*args, **kwargs)
