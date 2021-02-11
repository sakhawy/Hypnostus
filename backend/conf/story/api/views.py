from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken import views
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from datetime import datetime, timedelta 
from story.api import serializers
from story import models

# HOLYSHIT THE CODE IS A MESS
# I sould've put all of the stories into one view and depending on the 
# data or params I change functionality

# TODO: add a thing to check for all the needed data with every api call

@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_root_stories_view(request):
    if request.method == "GET":
        data = request.GET

        if data.get("username", 0):
            try:
                user = models.User.objects.get(username=data["username"])
            except:
                return Response({'error': 'User Doesn\'t Exists'}, status=status.HTTP_400_BAD_REQUEST)

            past_week = datetime.now() - timedelta(days=7)
            all_user_stories = sorted (
                # get all main from past week
                models.Story.objects.filter(user=user).filter(created__gte=past_week),    
                key=lambda x: x.value,
                reverse=True
            )    # sort by votes 

            context = {"user": request.user}
            serializer = serializers.StorySerializer(all_user_stories, many=True, context=context)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if not data.get("id", 0):

            past_week = datetime.now() - timedelta(days=7)
            all_stories = sorted (
                # get all main from past week
                models.Story.objects.filter(parent=None).filter(created__gte=past_week),    
                key=lambda x: x.value,
                reverse=True
            )    # sort by votes 

            context = {"user": request.user}
            serializer = serializers.StorySerializer(all_stories, many=True, context=context)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            try:
                story = models.Story.objects.get(id = int(data["id"]))
            except:
                return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = serializers.StorySerializer(story, context={"user": request.user})
            serializer.data.update({"n": 0})  # default
            return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        data = request.data.copy()
        data.update({"user": request.user.id})
        serializer = serializers.StorySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == "PUT":
        try:
            story = models.Story.objects.get(id=request.data["id"])
            if not story.user == request.user:
                return Response({"error": "Un-Authorized"}, status=status.HTTP_401_UNAUTHORIZED)

        except:
            return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.copy()
        data.update({"user": request.user.id})
        serializer = serializers.StorySerializer(story, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        try:
            story = models.Story.objects.get(id=request.data["id"])
        except:
            return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        story.delete()
        return Response({"id": request.data["id"]}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_nth_best_branch(request):
    data = request.GET
    try:
        story = models.Story.objects.get(id = int(data["id"]))
    except:
        return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)
    
    branch = models.Story.get_nth_path(story, int(data["rank"]))
    serializer = serializers.StorySerializer(branch.values(), many=True)
    return Response(
        {
            "branch": serializer.data,
            "id": story.id,
            "rank": data["rank"]
        }, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_parent(request):
    data = request.GET
    try:
        story = models.Story.objects.get(id = int(data["id"]))
    except:
        return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        parent = story.get_ancestors(ascending=True)[0]
    except:
        return Response({"error": "Story's Parent Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)
        
    serializer = serializers.StorySerializer(parent, context={"user": request.user})
    
    # res_data = serializer.data.copy()
    # res_data.update({"n": 0})

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_nth_child(request):
    data = request.GET
    try:
        story = models.Story.objects.get(id = int(data["id"]))
    except:
        return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        nth_child = models.Story.get_nth_child(story, int(data["n"]))
        serializer = serializers.StorySerializer(nth_child, context={"user": request.user})
        res_data = serializer.data.copy()
        # res_data.update({"n": data["n"]})
        return Response(res_data, status=status.HTTP_200_OK)
    except:
        return Response({"error": "Can't Get Child"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def vote_entity(request):
    if request.method == "GET":
        votes = models.Vote.objects.filter(user=request.user)
        res_data = {}
        for vote in votes:
            res_data[vote.entity.id] = vote.value
        
        return Response(res_data, status=status.HTTP_200_OK)


    if request.method == 'POST':
        # the way ive come up with to detect the entity :
        # request : {entity_typt: ???, entity_id: ???}
        
        # FIXME: THIS IS SO FUCKING BAD. FIX ENTITY FIELD SERIALIZER OR TRY ANOTHER METHOD TO GENERALIZE VOTE.

        # create vote
        data = request.data.copy()
        data.update({"user": request.user.id})    
        serializer = serializers.VoteSerializer(data=data, context=data)
        if serializer.is_valid():
            serializer.save()

            if data["entity_type"] == "story":
                story = models.Story.objects.get(id=data["entity"])
                entity_serializer = serializers.StorySerializer(story, context={"user": request.user}) 

            elif data["entity_type"] == "comment":
                story = models.Comment.objects.get(id=data["entity"])
                
                # this is kinda bad that i have to add the context here, if you wanna fix it, change the way you get user vote
                entity_serializer = serializers.CommentSerializer(story, context={"user": request.user})    

            return Response(entity_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticatedOrReadOnly])
def comment_view(request):
    if request.method == "GET":
        data = request.GET

        if data.get("username", 0):
            # filter comments with username
            try:
                user = models.User.objects.get(username=data["username"])
            except:
                return Response({'error': 'User Doesn\'t Exists'}, status=status.HTTP_400_BAD_REQUEST)

            comments = models.Comment.objects.filter(user=user)
            comments_serializer = serializers.CommentSerializer(comments, many=True)
            return Response([comment for comment in comments_serializer.data], status=status.HTTP_200_OK)

        if data.get("story", 0):
            # filter comments with story
            try:
                story = models.Story.objects.get(id=data["story"])
            except:
                return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST) 
            
            comments = models.Comment.objects.filter(
                story_id=data["story"], 
                parent=None     # this will get the root stories if no parent and children if parent
            )

            # user context for user_vote 
            serializer = serializers.CommentSerializer(comments, many=True, context={"user": request.user}) 
            return Response([comment for comment in serializer.data], status=status.HTTP_200_OK)

        if data.get("parent", 0):
            try:
                parent_comment = models.Comment.objects.get(id=data["parent"])
            except:
                return Response({'error': "Comment Doesn't Exist"})
            
            sub_comments = models.Comment.objects.filter(parent=parent_comment)
            sub_comments_serializer = serializers.CommentSerializer(sub_comments, many=True, context={"user": request.user})

            return Response([comment for comment in sub_comments_serializer.data], status=status.HTTP_200_OK)
            

    elif request.method == "POST":
        data = request.data.copy()
        data.update({"user": request.user.id})
        serializer = serializers.CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "PUT":
        # THIS METHOD SUCKS CAUSE I HAVE TO RE-CREATE THE THING AGAIN
        try:
            comment = models.Comment.objects.get(id=request.data["id"])
            if not comment.user == request.user:
                return Response({"error": "Un-Authorized"}, status=status.HTTP_401_UNAUTHORIZED)

        except:
            return Response({"error": "Comment Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data.update({"user": request.user.id})
        serializer = serializers.CommentSerializer(comment, data=data, context={"user": request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        print(request.data)
        try:
            comment = models.Comment.objects.get(id=request.data["id"])
            if not comment.user == request.user:
                return Response({"error": "Un-Authorized"}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({"error": "Comment Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST) 

        serializer_data = serializers.CommentSerializer(comment).data
        
        comment.delete()
        return Response(serializer_data, status=status.HTTP_200_OK)

@api_view(["POST"])
def user_login_view(request):
    # manual authentication
    try:
        unauth_user = models.User.objects.get(username=request.data["username"])
    except: # doesn't exist
        return Response({"error": "Bad Credintials."}, status=status.HTTP_400_BAD_REQUEST)

    valid_password = check_password(request.data["password"], unauth_user.password)
    if valid_password:
        token, created = Token.objects.get_or_create(user=unauth_user)

        user_serializer = serializers.UserSerializer(unauth_user)
        data = {'token': token.key}
        data.update(user_serializer.data)
        return Response(data, status=status.HTTP_200_OK)  # if the user registered outside api, create token
    return Response({"error": "Bad Credintials."}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
def user_registration_view(request):
    # TODO: auto-create the token when creating the profile
    # TODO: the profile also must be created automatically
    try:
        user_serializer = serializers.UserSerializer(data=request.data)
    except:
        return Response({'error': 'Username Already Exists'}, status=status.HTTP_400_BAD_REQUEST)

    if user_serializer.is_valid():
        user = user_serializer.save()
        token = Token.objects.create(user=user)
        profile_serializer = serializers.ProfileSerializer(data={"user": user.id})
        if profile_serializer.is_valid():
            profile_serializer.save()
            print("saved")
            print(models.Profile.objects.all())
            data = {'token': token.key}
            data.update(user_serializer.data)
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticatedOrReadOnly])
def profile_view(request):
    # TODO: add some privacy options and permissions on certain profile fields 
    if request.method == "GET":
        data = request.GET
        print(data)
        # get the profile
        try:
            profile = models.Profile.objects.get(user=models.User.objects.get(username=data["username"]))
        except:
            return Response({"error": "Profile Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)

        requesting_profile = models.Profile.objects.get(user=request.user)
        profile_serializer = serializers.ProfileSerializer(profile, context={"profile": requesting_profile})
        return Response(profile_serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        # edit the profile
        pass


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request):
    # this function returns the follower and the followed
     
    # POST request

    data = request.data
    print(data)
    try:
        following_user = models.User.objects.get(username=data["username"])
        following = models.Profile.objects.get(user=following_user)
    except:
        return Response({'error': 'User Doesn\'t Exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    follower = models.Profile.objects.get(user=request.user)

    # create/delete the follow [1 or 0]
    models.Follow.follow(profile=follower, following=following)
    
    # return profile, following
    follower_serializer = serializers.ProfileSerializer(follower, context={"profile": follower})    # context for the requesting profile
    following_serializer = serializers.ProfileSerializer(following, context={"profile": follower})

    return Response({"follower": follower_serializer.data, "following": following_serializer.data}, status=status.HTTP_200_OK)

