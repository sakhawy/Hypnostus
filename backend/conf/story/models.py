from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from mptt.models import MPTTModel, TreeForeignKey
import json

class User(AbstractUser):
    def __str__(self):
        return self.username

    def __repr__(self):
        return self.username

class Story(MPTTModel):
    """
    So, the value will look something like this 
    {self_id: value, child_1_id: value, child_2_id: value ... }
    GOAL: Least possible db queries.
    """
    # TODO: Update when delete (somehow i forgot to add that :))
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
    
    @staticmethod
    def vote(story):
        """
        This function updates the values of a node and its ancestors.
        It assigns the value of the node's upvotes plus its maximum children values to its parent.
        And does the same with the node's parent, and so on till root.
        """
        value = len(story.upvotes.all()) - len(story.downvotes.all()) + Story.get_max_children_values(story.children_values)

        ancestors = story.get_ancestors(ascending=True)
        story.value = value
        child_story = story
        for anc_story in ancestors:
            # change the value of the child_story in parent
            anc_story.children_values = Story.added_value(anc_story.children_values, str(child_story.id), value)

            # update the child_story and value to be of the parent -for the next parent-
            child_story = anc_story
            value = len(child_story.upvotes.all()) - len(child_story.downvotes.all()) + Story.get_max_children_values(child_story.children_values)

            # save the new value to the parent
            anc_story.value = value

        Story.objects.bulk_update(list(ancestors)+[story], ['children_values', 'value'])


    @staticmethod
    def default_value(story):
        "Will be called in save -after story gets saved- to initialize the stoy in its parent."
        anc = story.get_ancestors(ascending=True)
        if anc:
            parent = anc[0]
            parent.children_values = Story.added_value(parent.children_values, story.id, 0) # add child to parent's children_values field
            parent.save()

    name = models.CharField(max_length=500, blank=True, null=True)
    content = models.CharField(max_length=100000)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name="children")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    children_values = models.JSONField(blank=True, null=True)
    value = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} #{self.id}"

    def __repr__(self):
        return self.name

    def save(self, *args, **kwargs):
        # ok, this took me some time
        # i've overridden save many times but this one is different since i need an id first
        if not self.id:
            super().save(*args, **kwargs) 
            Story.default_value(self)
        else:
            super().save(*args, **kwargs)

class Vote(models.Model):

    @staticmethod
    def get_if_exist(user, story):
        "Get the vote instance if it exist in the user's vote set"
        for vote in user.vote_set.all():
            # find an occupied vote
            if vote.upvoted_story == story or vote.downvoted_story == story:
                return vote
        
        # find a none vote if no occupied   (this leaves no vote untaken)
        if vote.upvoted_story == vote.downvoted_story:
            return vote
        
        return None

    @staticmethod
    def upvote(vote, story):
        vote.downvoted_story = None
        vote.upvoted_story = story
        vote.save()
        # update
        Story.vote(story)

    @staticmethod
    def downvote(vote, story):
        vote.upvoted_story = None
        vote.downvoted_story = story
        vote.save()
        Story.vote(story)
    
    @staticmethod
    def unvote(vote, story):
        vote.upvoted_story = None
        vote.downvoted_story = None
        vote.save()
        Story.vote(story)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    upvoted_story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name="upvotes", blank=True, null=True)
    downvoted_story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name="downvotes", blank=True, null=True)

    def save(self, *args, **kwargs):        
        # add exception handling for cloned stories bruh. (to ensure using upvote, downvote and unvote functions)
        # can't save with upvoted_story & downvoted_story filled
        print(f"UPVOTED : {self.upvoted_story}, DOWNVOTED : {self.downvoted_story}")
        if self.upvoted_story and self.downvoted_story:
            raise Exception("Vote Already Exists (upvoted/downvoted)") 

        for vote in self.user.vote_set.all():
            if vote.id != self.id:  # save is called to update too, so check if the stories are different first
                # can't save if upvoted_story is in user's votes
                if self.upvoted_story == vote.upvoted_story and (self.upvoted_story != None):
                    raise Exception("Vote Already Exists: Can't upvote because user alreay upvoted this story")
                if self.upvoted_story == vote.downvoted_story and (self.upvoted_story != None):
                    raise Exception("Vote Already Exists: Can't upvote because user alreay downvoted this story")
                
                # cant save if downvoted_stroy is in user's votes      
                if self.downvoted_story == vote.upvoted_story and (self.downvoted_story != None):
                    raise Exception("Vote Already Exists: Can't downvote because user alreay upvoted this story")
                if self.downvoted_story == vote.downvoted_story and (self.downvoted_story != None):
                    raise Exception("Vote Already Exists: Can't downvote because user alreay downvoted this story")
            
                # prevent user from creating new empty votes
                if self.upvoted_story == vote.upvoted_story and self.downvoted_story == vote.downvoted_story:   # the only case for this is None, None
                    raise Exception("Can't Create New Empty Votes: This user already has an unoccupied vote to be used.")

        super().save(*args, **kwargs)

    def __str__(self):
        if self.upvoted_story:
            return f"#{self.id} For {self.upvoted_story.name}"
        elif self.downvoted_story:
            return f"#{self.id} For {self.downvoted_story.name}"
        else:
            return f"#{self.id}"
    def __repr__(self):
        if self.upvoted_story:
            return f"#{self.id} For {self.upvoted_story.name}"
        elif self.downvoted_story:
            return f"#{self.id} For {self.downvoted_story.name}"
        else:
            return f"#{self.id}"
