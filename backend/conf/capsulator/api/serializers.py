from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from rest_framework import permissions

from capsulator import models, tokens

# class IsCapsuleAdmin(permissions.BasePermission):
#     def has_permission(self, request, view):
#         try:
#             member = models.Member.objects.get(user=request.user)
#             return member.state == models.Member.ADMIN
            
#         except:
#             return False

#     def has_object_permission(self, request, view):
#         try:
#             member = models.Member.objects.get(user=request.user)
#             print(f"Permission is {member.state}")
#             return member.state == models.Member.ADMIN
            
#         except:
#             return False

class AdminOnlyField(serializers.Field):
    '''
    Validates a 'Member' instance for having the state 'Member.ADMIN'
    '''
    def get_attribute(self, obj):
        return obj

    def to_representation(self, member):
        return member.state

    def to_internal_value(self, obj):
        #### TODO: FIND A BETTER WAY TO DO THIS!!
        # '''
        # Permitting only the 'Member.ADMIN' for writing.
        # '''

        # request = self.context.get('request', None)
        # if not request:
        #     raise Exception("'request' is not found.")
        # user = request.user

        # try:
        #     member = models.Member.objects.get(user=user)
        #     if not member.state == models.Member.ADMIN:
        #         raise serializers.ValidationError(f"Unauthorized write to the field '{self.field_name}'.")     
        #     return obj
        # except models.Member.DoesNotExist:
        #     raise Exception("'member' is not found.")
        return obj

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Token
        fields = ["key"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        # fields = ["id", "username", "email", "password", "token", "is_active"]
        fields = ["id", "username", "email", "password", "is_active"]
        # lookup_field = "username"

    def create(self, validated_data):
        """Overloaded to hash the password using set_password
        instead of plaintext passwords. I used set_password here and
        didn't overload User.save method because I ran into problems
        with createsuperuser which already uses set_password."""
        print("VALIDATED DATA: ", validated_data)
        user = models.User(username=validated_data["username"], email=validated_data["email"])
        user.set_password(validated_data["password"])
        
        user.is_active = False
        user.save()

        # Activation token
        # NOTE: It must be created AFTER user is saved.
        activation_token = tokens.account_activation_token.make_token(user)

        print(activation_token)

        return user

    # Nested token serializer for user creations.
    # token = TokenSerializer(source="auth_token", read_only=True)


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Member
        fields = ["id", "user", "capsule", "state", "status", "user_name", "resource"]

        # API exception for when user creates 2 Member instances.
        validators = [
            UniqueTogetherValidator(
                queryset=model.objects.all(),
                fields=['user', 'capsule'],
                message="User is already registered in the capsule."
            )
        ]

    state = AdminOnlyField(required=False)
    user_name = serializers.SerializerMethodField('get_user_name')
    resource = serializers.SerializerMethodField('get_resource')

    def get_user_name(self, member):
        return f"{member.user.first_name} {member.user.last_name}"

    def get_resource(self, member):
        try:
            return member.resource.id
        except:
            return None

    def validate_state(self, value):
        # Validation for illegal action
        if not self.instance:
            if value != models.Member.WAITING:
                raise serializers.ValidationError("Illegal action. Unauthorized.")
        
        ## This is kind of useless :)
        # else:
        #     print(self.instance.state)
        #     # New state can't be admin. 
        #     # New state can't be equal to old state.
        #     if value == models.Member.ADMIN or value == self.instance.state:
        #         raise serializers.ValidationError("Illegal action. Unauthorized or duplicated.")
        
        return value

    def validate_status(self, value):
        # Check if there's a resource before getting ready
        if value == models.Member.READY:
            try:
                if self.instance.resource.message and self.instance.resource.images:
                    return value
            except:
                raise serializers.ValidationError("Cannot get ready without submitting something first")
            else:
                raise serializers.ValidationError("Cannot get ready without submitting something first")
        return value

class CapsuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Capsule
        fields = ["id", "key", "name", "state", "is_public", "creation_date", "locking_date", "unlocking_date", "members"]

    # Capsule can return its members in the response
    members = MemberSerializer(read_only=True, many=True)
    lookup_key = "key"

    def validate_state(self, value):
        # Check if the capsule is being locked while some members aren't ready
        if value == models.Capsule.LOCKED and self.instance.members.all().filter(status=models.Member.NOT_READY):
            raise serializers.ValidationError("Cannot lock the capusle while some members aren't ready.")
        return value

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.File
        fields = ["id", "resource", "content"]
    
class ResourceSerializer(serializers.ModelSerializer):
    images = FileSerializer(many=True, read_only=True)
    class Meta:
        model = models.Resource
        fields = ["id", "member", "message", "images"]
