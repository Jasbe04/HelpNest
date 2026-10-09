from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Profile


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = (
        "id",
        "username",
        "email",
        "is_staff",
        "is_active",
    )

    search_fields = ("username", "email")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "institution",
        "company",
        "job_title",
        "is_available_for_mentorship",
    )

    search_fields = (
        "user__username",
        "user__email",
        "institution",
        "company",
        "job_title",
    )

    list_filter = (
        "is_available_for_mentorship",
        "industry",
    )