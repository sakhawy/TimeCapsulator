from django.contrib import admin
from django.urls import path, include 
from capsulator.api import views

from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('authenticate/', views.authenticate),
    path('profile/', views.UserDetail.as_view()),
    path('capsule/', views.CapsuleList.as_view()),
    path('capsule/<int:key>/', views.CapsuleDetail.as_view()),
    path('member/', views.MemberList.as_view()),
    path('member/<int:id>/', views.MemberDetail.as_view()),
    path('resource/', views.ResourceList.as_view()),
    path('resource/<int:id>/', views.ResourceDetail.as_view()),
]
