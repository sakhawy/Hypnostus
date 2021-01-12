from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken import views
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from story.api import serializers
from story import models

@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_root_stories_view(request):
    if request.method == "GET":
        data = request.GET
        if not data.get("id", 0):
            all_stories = models.Story.objects.filter(parent=None)
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
def vote_story(request):
    if request.method == "GET":
        votes = models.Vote.objects.filter(user=request.user)
        res_data = {}
        for vote in votes:
            res_date[vote.entity.id] = vote.value
        
        return Response(res_data, status=status.HTTP_200_OK)


    if request.method == 'POST':
        try:
            story = models.Story.objects.get(id=request.data["entity"])
        except:
            return Response({"error": "Story Doesn't Exist"}, status=status.HTTP_400_BAD_REQUEST)

        # create vote
        data = request.data.copy()
        data.update({"user": request.user.id})
        serializer = serializers.VoteSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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