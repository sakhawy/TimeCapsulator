from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from rest_framework.authtoken.models import Token

from string import ascii_letters, digits
import random 

class ObjectAlreadyExist(Exception):
    def __init__(self):
        self.message = "The object you're trying to create already exists."
        super().__init__(self.message)

# TODO: create a custom manager for handling user creation to
# hash the password before creating the user and doing such
# tasks.

# class UserManager(BaseUserManager):
#     '''
#     Created to use set_password on user creation.
#     '''
#     def create_user(self, email, username, password=None):
#         if not email:
#             raise Exception("Email is required.")
#         if not username:
#             raise Exception("Username is required.")
        
#         user = self.model(email=self.normalize_email(email), username=username)
#         user.set_password(password)
#         user.save()
        
#         return user

#     def create_superuser(self, email, username, password=None):
#         user = self.create_user(email=email, username=username, password=password)
        
#         # Set superuser permissions.
#         user.is_admin = True
#         user.is_staff = True
#         user.is_superuser = True
        
#         user.save()

#         return user

class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    # Priority email & use it instead of username in logins.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} #{self.id}"

    def __repr__(self):
        return f"{self.username} #{self.id}"



@receiver(post_save, sender=User)
def create_auth_token(sender, instance, created, **kwargs):
    # Create a token for every new user
    if created:
        Token.objects.create(user=instance)

class Capsule(models.Model):
    KEY_LENGTH = 20

    CREATED = 0
    LOCKED = 1
    UNLOCKED = 2

    STATES = [
        (CREATED, "Created"),
        (LOCKED, "Locked"),
        (UNLOCKED, "Opened")
    ]

    name = models.CharField(max_length=100)
    # Capsule will be accesible by the (ID and KEY)
    key = models.CharField(max_length=KEY_LENGTH, blank=True, null=True)
    state = models.IntegerField(choices=STATES, default=CREATED, blank=True, null=True)
    creation_date = models.DateTimeField(blank=True, null=True)
    locking_date = models.DateTimeField(blank=True, null=True)
    unlocking_date = models.DateTimeField(blank=True, null=True)
    is_public = models.BooleanField(False)

    def save(self, *args, **kwargs):
        # if not self.id:
            # Update DateTimeFields
            # self.creation_date = timezone.now()

        # TODO: Clean this up if possible
        # Set DateTimeFields (ugly)
        if self.state == Capsule.CREATED:
            self.creation_date = timezone.now()
        elif self.state == Capsule.LOCKED:
            # Validation
            if not self.id:
                raise Exception("Cannot lock capsule on creation.")
            for member in self.members.all():
                if member.status == Member.NOT_READY:
                    raise Exception("Cannot lock the Capsule, members aren't ready.")
            self.locking_date = timezone.now()
        else:
            if not self.id:
                raise Exception("Cannot unlock capsule on creation.")
            self.unlocking_date = timezone.now()
        
        return super().save(*args, **kwargs)


    def __str__(self):
        return self.name
    
    def __repr__(self):
        return self.name

@receiver(post_save, sender=Capsule)
def create_random_key(sender, instance, created, **kwargs):
    # Create a random key for every new capsule
    if created:
        # The id in the end is to make sure it's unique :)
        instance.key = "".join(random.choice(ascii_letters + digits) for i in range(Capsule.KEY_LENGTH - len(str(instance.id)))) + str(instance.id)
        instance.save()

class Member(models.Model):
    class Meta:
        permissions = [('capsule_admin', 'Member is admin for Capsule.')]

    ADMIN_PERM = 'member.capsule_admin'    
    ADMIN = "A"
    MEMBER = "M"
    WAITING = "W"
    BLOCKED = "B"
    STATES = [
        (ADMIN, "Admin"),
        (MEMBER, "Member"),
        (WAITING, "Waiting"),
        (BLOCKED, "Blocked")
    ]
    READY = "R"
    NOT_READY = "N"
    STATUS = [
        (READY, "Ready"),
        (NOT_READY, "Not Ready")
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    capsule = models.ForeignKey(Capsule, on_delete=models.CASCADE, related_name="members")
    state = models.CharField(max_length=1, choices=STATES, default=WAITING)
    status = models.CharField(max_length=1, choices=STATUS, default=NOT_READY)

    def save(self, *args, **kwargs):
        # Handle logical errors for the 'status' and 'state'
        if self.status == Member.READY and self.state in [Member.BLOCKED, Member.WAITING]:
            raise Exception("Cannot change 'status' to ready to non-members")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} #{self.id}"

    def __repr__(self):
        return f"{self.user.username} #{self.id}"

@receiver(post_save, sender=Member)
def handle_membership(sender, instance, created, **kwargs):
    '''
    Automatically make the first Member instance to join a Capsule an admin
    '''
    if created:
        # First capsule member is automatically an admin
        # TODO: Handle when admin leaves
        if len(instance.capsule.members.all()) == 1: 
            instance.state = Member.ADMIN
            instance.save()
        
        for member in instance.capsule.members.all():
            if member.user == instance.user and member.id != instance.id:
                Member.objects.get(id=instance.id).delete() # instance.delete() gives error.
                raise ObjectAlreadyExist()

class Resource(models.Model):
    member = models.OneToOneField(Member, on_delete=models.CASCADE, related_name="resource")
    message = models.CharField(max_length=10000)

    def __str__(self):
        return f"{self.member}"

    def __repr__(self):
        return f"{self.member}"

class File(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="images")
    content = models.FileField()

    def __str__(self):
        return self.content.url

    def __repr__(self):
        return self.content.url
