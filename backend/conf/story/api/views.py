from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken import views
from rest_framework.permissions import IsAuthenticated
from story.api import serializers
from story import models

@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def get_root_stories_view(request):
    if request.method == "GET":
        all_stories = models.Story.objects.filter(parent=None)
        serializer = serializers.StorySerializer(all_stories, many=True)
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
    try:
        story = models.Story.objects.get(id = request.data["story"])
    except:
        return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)
    
    branch = models.Story.get_nth_path(story, int(request.data["rank"]))
    serializer = serializers.StorySerializer(branch.values(), many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def vote_view(request):
    try:
        story = models.Story.objects.get(id=request.data["id"])
    except:
        return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)

    # vote
    user = request.user
    vote = models.Vote.get_if_exist(user=user, story=story)
    if vote == None:
        # creating serializer to catch errors using is_valid
        data = {"user": request.user.id}
        serializer = serializers.VoteSerializer(data=data)
        if serializer.is_valid():
            vote = serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    actions = {"1": models.Vote.upvote, "-1": models.Vote.downvote, "0": models.Vote.unvote}
    action = actions[request.data["value"]]
    action(vote, story)

    # create serializer then return
    serializer = serializers.VoteSerializer(vote)
    return Response(serializer.data, status=status.HTTP_200_OK)

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
        return Response({'token': token.key}, status=status.HTTP_200_OK)  # if the user registered outside api, create token
    return Response({"error": "Bad Credintials."}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
def user_registration_view(request):
    try:
        serializer = serializers.UserSerializer(data=request.data)
    except:
        return Response({'error': 'Username Already Exists'}, status=status.HTTP_400_BAD_REQUEST)
        
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)