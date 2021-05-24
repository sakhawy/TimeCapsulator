from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from capsulator.api import serializers
from rest_framework.views import APIView

from rest_framework import permissions

from rest_framework import exceptions

from django.http import Http404

from capsulator import models, tokens

@api_view(["POST"])
def activate_user(request, id, token):
    try:
        user = models.User.objects.get(id=id)

    except:
        user = None

    if user != None:
        # Check if token is valid.
        if tokens.account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            token = user.auth_token
            print(token)
            token_serializer = serializers.TokenSerializer(token)
            return Response(token_serializer.data, status=status.HTTP_200_OK)

    raise exceptions.APIException('Invalid Data')

class UserList(APIView):
    def post(self, request, format=None):
        user_serializer = serializers.UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()    
            return Response(user_serializer.data['token'], status=status.HTTP_201_CREATED)
    
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResourceList(APIView):
    ### ADD META
    def post(self, request, format=None):
        
        try:
            member = models.Member.objects.get(id=request.data.get('member', None))
        except models.Member.DoesNotExist:
            raise Http404

        resource_serializer = serializers.ResourceSerializer(data=request.data)
        if resource_serializer.is_valid():
            resource_serializer.save()
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
        
        return Response(resource_serializer.data, status=status.HTTP_200_OK)

class CapsuleList(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, serializers.IsCapsuleAdmin]

    def post(self, request, format=None):
        """Create capsule"""
        capsule_serializer = serializers.CapsuleSerializer(data=request.data)
        if capsule_serializer.is_valid():
            capsule_serializer.save()
            return Response(capsule_serializer.data, status=status.HTTP_201_CREATED)
        return Response(capsule_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CapsuleDetail(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, serializers.IsCapsuleAdmin]
    def put(self, request, key, format=None):
        try:
            capsule = models.Capsule.objects.get(key=key)

        except models.Capsule.DoesNotExist:
            raise Http404
        
        capsule_serializer = serializers.CapsuleSerializer(
            capsule,
            data=request.data,
            context={'request': request},
            partial=True    # For partial updates.
        )

        if capsule_serializer.is_valid():
            capsule_serializer.save()
            return Response(capsule_serializer.data, status=status.HTTP_200_OK)
        
        return Response(capsule_serializer.errors, status=status.HTTP_204_NO_CONTENT)



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
            capsule = models.Capsule.objects.get(id=request.data.get("capsule", None), key=request.data.get("key", None))

        except models.Capsule.DoesNotExist:
            raise Http404("Capsule doesn't exist.")

        fields = [x.name for x in models.Member._meta.fields]
        member_data = {x: request.data[x] for x in fields & request.data.keys()}

        # Creation must be restricted to the current user
        member_data["user"] = request.user.id

        member_serializer = serializers.MemberSerializer(data=member_data)
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

        requested_member_serializer = serializers.MemberSerializer(
            requested_member,
            data=request.data,
            context={'request': request},
            partial=True    # For partial updates.
        )

        if requested_member_serializer.is_valid():
            requested_member_serializer.save()
            return Response(requested_member_serializer.data, status=status.HTTP_200_OK)
        
        return Response(requested_member_serializer.errors, status=status.HTTP_204_NO_CONTENT)
