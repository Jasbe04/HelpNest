
from django.contrib import admin
from .models import CustomUser, Profile


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "account_type",
        "is_active",
    )

    list_filter = (
        "account_type",
        "is_active",
    )

    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
    )


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

    list_filter = (
        "institution",
        "is_available_for_mentorship",
    )

    search_fields = (
        "user__username",
        "user__email",
        "company",
        "job_title",
    )

