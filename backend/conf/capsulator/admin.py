from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
from capsulator import models

class CustomUserAdmin(UserAdmin):
    # add_form = UserCreateForm
    list_display = ["__str__"]
    prepopulated_fields = {'username': ('first_name' , 'last_name', )}

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'email', 'username', 'password1', 'password2',),
        }),
    )


class CapsuleAdmin(admin.ModelAdmin):
    list_display = ["__str__"]

class MemberAdmin(admin.ModelAdmin):
    list_display = ["__str__"]

class ResourceAdmin(admin.ModelAdmin):
    list_display = ["__str__"]

class FileAdmin(admin.ModelAdmin):
    list_display = ["__str__"]


admin.site.register(models.User, CustomUserAdmin)
admin.site.register(models.Capsule, CapsuleAdmin)
admin.site.register(models.Member, MemberAdmin)
admin.site.register(models.Resource, ResourceAdmin)
admin.site.register(models.File, FileAdmin)