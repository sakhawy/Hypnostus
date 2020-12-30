from django.urls import path
from story.api import views

urlpatterns = [
    path('story/', views.get_root_stories_view),
    path('login/', views.user_login_view),
    path('register/', views.user_registration_view),
    path('story/branch/', views.get_nth_best_branch),
    path('story/vote/', views.vote_view),

]