from django.contrib import admin
from .models import MentorshipRequest, Notification


@admin.register(MentorshipRequest)
class MentorshipRequestAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "student",
        "mentor",
        "topic",
        "status",
        "created_at",
    )

    list_filter = ("status", "topic", "created_at")

    search_fields = (
        "title",
        "student__username",
        "mentor__username",
    )


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "recipient",
        "notification_type",
        "is_read",
        "created_at",
    )

    list_filter = ("notification_type", "is_read")