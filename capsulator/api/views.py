from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from capsulator.api import serializers
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import exceptions
from rest_framework.authtoken.models import Token

from django.http import Http404
from django.core.exceptions import PermissionDenied
from django.conf import settings

# Google auth
from google.oauth2 import id_token
from google.auth.transport import requests 

# Email
from capsulator import tasks

from capsulator import models, tokens

@api_view(["POST"])
def authenticate(request):
    "This is a temporary way of implementing Google OAuth2. Will be deleted once I manage to do it the proper way."
    # Check if the email exists in the database. Create a user if not. Then return a toke. 
    try:
        client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
        idinfo = id_token.verify_oauth2_token(request.data['code'], requests.Request(), client_id)
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            return Response({'detail': 'Wrong issuer'}, status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'detail': 'Bad authorization code.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = models.User.objects.get(email=idinfo['email'])
        
    except:
        user = models.User(
            first_name=idinfo['given_name'],
            last_name=idinfo['family_name'],
            username=idinfo['email'].split("@")[0],
            email=idinfo['email'],
            # profile_picture=idinfo['picture']
        )
        user.save()
    
    try:
        token = user.auth_token
    except:
        token = Token.objects.create(user=user)

    token_serializer = serializers.TokenSerializer(token)
    return Response(token_serializer.data, status=status.HTTP_200_OK)
    
class UserList(APIView):
    def post(self, request, format=None):
        user_serializer = serializers.UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()    
            return Response(user_serializer.data['token'], status=status.HTTP_201_CREATED)
    
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        user_serializer = serializers.UserSerializer(request.user)
        return Response(user_serializer.data, status=status.HTTP_200_OK)

class ResourceList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        "Returns a list of 'Resource's from a give capsule key"
        try:
            capsule = models.Capsule.objects.get(key=request.GET.get("key", None))
        except models.Capsule.DoesNotExist:
            raise Http404

        # Check that user is authorized
        try:
            member = models.Member.objects.filter(user=request.user, capsule=capsule)[0]
        except IndexError:
            raise PermissionDenied

        # View if available
        if capsule.state not in [models.Capsule.CREATED, models.Capsule.UNLOCKED]:
            raise PermissionDenied

        capsule_resources = models.Resource.objects.filter(member__in=capsule.members.all())
        capsule_resources_serializer = serializers.ResourceSerializer(capsule_resources, many=True)
        return Response(capsule_resources_serializer.data, status=status.HTTP_200_OK)



    ### ADD META
    def post(self, request, format=None):
        "Creates a resource with its image files for the requesting user."

        try:
            # Only the user's members
            member = models.Member.objects.filter(user=request.user.id).get(id=request.data.get('member', None))
            
        except models.Member.DoesNotExist:
            raise Http404

        # Create if available
        if member.capsule.state != models.Capsule.CREATED:
            raise PermissionDenied

        resource_serializer = serializers.ResourceSerializer(data=request.data)
        if resource_serializer.is_valid():
            resource = resource_serializer.save()
            for content in request.FILES.getlist('content'):
                file_serializer = serializers.FileSerializer(data={
                    "resource": resource_serializer.data['id'],
                    "content": content     
                })
                if file_serializer.is_valid():
                    file_serializer.save()

                else:
                    return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(resource_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the serializer with the new images
        resource_serializer = serializers.ResourceSerializer(resource)

        return Response(resource_serializer.data, status=status.HTTP_201_CREATED)

class ResourceDetail(APIView):
    def get(self, request, id, format=None):
        "Gets a resource with its image files for the requesting user."
        
        try:
            # Only the user's members
            member = models.Member.objects.filter(user=request.user.id).get(id=id)
            resource = models.Resource.objects.get(member=member)

        except models.Member.DoesNotExist:
            raise PermissionDenied
        
        except models.Resource.DoesNotExist:
            raise Http404
        
        # View if available
        if member.capsule.state not in [models.Capsule.CREATED, models.Capsule.UNLOCKED]:
            raise PermissionDenied

        resource_serializer = serializers.ResourceSerializer(resource)
        
        return Response(resource_serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id, format=None):
        try:
            # Only the user's members
            member = models.Member.objects.filter(user=request.user.id).get(id=id)
            resource = models.Resource.objects.get(member=member)

        except models.Member.DoesNotExist:
            raise PermissionDenied
        
        except models.Resource.DoesNotExist:
            raise Http404

        # Edit if available
        if member.capsule.state != models.Capsule.CREATED:
            raise PermissionDenied

        for content in request.FILES.getlist('content'):
            file_serializer = serializers.FileSerializer(data={
                "resource": resource.id,
                "content": content     
            })
            if file_serializer.is_valid():
                file_serializer.save()

            else:
                return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        resource_serializer = serializers.ResourceSerializer(resource, data=request.data)
        if resource_serializer.is_valid():
            resource_serializer.save()
            return Response(resource_serializer.data, status=status.HTTP_200_OK)

        return Response(resource_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CapsuleList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """Get users's capsules"""
        # NOTE: change this if you're going to use it to retrieve public capsules
        member_capsules = [x.capsule for x in models.Member.objects.filter(user=request.user, state__in=[models.Member.MEMBER, models.Member.ADMIN])] 
        capsule_serializer = serializers.CapsuleSerializer(member_capsules, many=True)
        return Response(capsule_serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        """Create capsule"""
        capsule_serializer = serializers.CapsuleSerializer(data=request.data)
        if capsule_serializer.is_valid():
            capsule_serializer.save()
            return Response(capsule_serializer.data, status=status.HTTP_201_CREATED)
        return Response(capsule_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CapsuleDetail(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, key, format=None):
        # Check if the member is admin first
        member = models.Member.objects.filter(capsule__key=key, user=request.user)
        if not member:
            raise Http404
        
        member = member[0]

        if member.state != models.Member.ADMIN:
            raise PermissionDenied

        capsule_members = models.Member.objects.filter(capsule__key=key)
        capsule_members_serializer = serializers.MemberSerializer(capsule_members, many=True)
        return Response(capsule_members_serializer.data, status=status.HTTP_200_OK)        

    def put(self, request, key, format=None):
        try:
            capsule = models.Capsule.objects.get(key=key)

        except models.Capsule.DoesNotExist:
            raise Http404

        # Edit if available
        if capsule.state != models.Capsule.CREATED:
            raise PermissionDenied
        
        capsule_serializer = serializers.CapsuleSerializer(
            capsule,
            data=request.data,
            context={'request': request},
            partial=True    # For partial updates.
        )

        if capsule_serializer.is_valid():
            capsule = capsule_serializer.save()

            # Create a task if the capsule is locked 
            if capsule.state == models.Capsule.LOCKED:
                user_id = request.user.id
                capsule_id = capsule.id
                capsule_url = request.get_host() + "/view/" + capsule.key + '/'
                # Async email sending when the unlocking_date comes 
                tasks.unlock_capsule_task.apply_async(
                    args=[
                        user_id,
                        capsule_id,
                        capsule_url
                    ],
                    eta=capsule.unlocking_date
                )

            return Response(capsule_serializer.data, status=status.HTTP_200_OK)
        
        return Response(capsule_serializer.errors, status=status.HTTP_404_NOT_FOUND)



class MemberList(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        members = models.Member.objects.all()
        member_serializer = serializers.MemberSerializer(members, many=True)
        return Response(member_serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        """Create member"""

        # A hack for identifying the capsule by the ID and the KEY.
        # The reason it's ID & KEY is for handling duplication (the l/eazy way) (hate this word too)
        # NOTE: The ideal way is to handle this in the serializers but I don't know how.
        try:
            capsule = models.Capsule.objects.get(key=request.data.get("key", None))

        except models.Capsule.DoesNotExist:
            raise Http404

        # Join if available
        if capsule.state != models.Capsule.CREATED:
            raise PermissionDenied

        fields = [x.name for x in models.Member._meta.fields]
        member_data = {x: request.data[x] for x in fields & request.data.keys()}

        # Creation must be restricted to the current user
        member_data["user"] = request.user.id

        # Manually add it since we get the capsule by key now.
        member_data["capsule"] = capsule.id

        member_serializer = serializers.MemberSerializer(
            data=member_data,
            context={'request': request}
        )
        
        if member_serializer.is_valid():
            member_serializer.save()
            return Response(member_serializer.data, status=status.HTTP_201_CREATED)
        return Response(member_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MemberDetail(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def put(self, request, id, format=None):
        # Change should only be available to admins (Handled in serializers.IsAdminCapsule)

        try:
            requested_member = models.Member.objects.get(id=id)
        except models.Member.DoesNotExist:
            raise Http404

        # Edit if available
        if requested_member.capsule.state != models.Capsule.CREATED:
            raise PermissionDenied

        requested_member_serializer = serializers.MemberSerializer(
            requested_member,
            data=request.data,
            context={'request': request},
            partial=True    # For partial updates.
        )

        if requested_member_serializer.is_valid():
            requested_member_serializer.save()
            return Response(requested_member_serializer.data, status=status.HTTP_200_OK)
        
        return Response(requested_member_serializer.errors, status=status.HTTP_403_FORBIDDEN)
