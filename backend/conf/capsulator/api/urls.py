from django.contrib import admin
from django.urls import path, include 
from capsulator.api import views

from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('register/', views.UserList.as_view()),
    # path('login/', obtain_auth_token),
    path('activate/<id>/<token>/', views.activate_user),
    path('auth/', include('rest_auth.urls')),
    path('capsule/', views.CapsuleList.as_view()),
    path('capsule/<int:key>/', views.CapsuleDetail.as_view()),
    path('member/', views.MemberList.as_view()),
    path('member/<int:id>/', views.MemberDetail.as_view()),
    path('resource/', views.ResourceList.as_view()),
]
