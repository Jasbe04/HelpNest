from rest_framework import serializers

from accounts.models import Profile
from .models import MentorshipRequest, Notification


class MentorshipRequestSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    mentor_name = serializers.SerializerMethodField()
    mentor_email = serializers.SerializerMethodField()
    mentor_linkedin_url = serializers.SerializerMethodField()

    topic_display = serializers.CharField(
        source="get_topic_display",
        read_only=True,
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    preferred_communication_display = serializers.CharField(
        source="get_preferred_communication_display",
        read_only=True,
    )

    class Meta:
        model = MentorshipRequest

        fields = [
            "id",
            "student",
            "student_name",
            "mentor",
            "mentor_name",
            "mentor_email",
            "mentor_linkedin_url",
            "topic",
            "topic_display",
            "title",
            "message",
            "specific_questions",
            "preferred_communication",
            "preferred_communication_display",
            "preferred_availability",
            "status",
            "status_display",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "student_name",
            "mentor_name",
            "mentor_email",
            "mentor_linkedin_url",
            "status",
            "status_display",
            "topic_display",
            "preferred_communication_display",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        full_name = obj.student.get_full_name()
        return full_name or obj.student.username

    def get_mentor_name(self, obj):
        full_name = obj.mentor.get_full_name()
        return full_name or obj.mentor.username

    def get_mentor_email(self, obj):
        if obj.status == MentorshipRequest.Status.ACCEPTED and obj.mentor:
            return obj.mentor.email
        return ""

    def get_mentor_linkedin_url(self, obj):
        if obj.status == MentorshipRequest.Status.ACCEPTED and obj.mentor:
            try:
                return obj.mentor.profile.linkedin_url or ""
            except AttributeError:
                return ""
        return ""

    def validate_mentor(self, mentor):
        request = self.context.get("request")

        if request is None or not request.user.is_authenticated:
            raise serializers.ValidationError(
                "Authentication is required."
            )

        student = request.user

        if student.pk == mentor.pk:
            raise serializers.ValidationError(
                "You cannot request mentorship from yourself."
            )

        if getattr(student, "account_type", None) != "student":
            raise serializers.ValidationError(
                "Only students can send mentorship requests."
            )

        if getattr(mentor, "account_type", None) != "alumni":
            raise serializers.ValidationError(
                "You can only request mentorship from alumni."
            )

        try:
            profile = mentor.profile
        except Profile.DoesNotExist:
            raise serializers.ValidationError(
                "This alumnus does not have a profile yet."
            )

        if not profile.is_available_for_mentorship:
            raise serializers.ValidationError(
                "This alumnus is not currently available for mentorship."
            )

        existing_request = MentorshipRequest.objects.filter(
            student=student,
            mentor=mentor,
            status__in=[
                MentorshipRequest.Status.PENDING,
                MentorshipRequest.Status.ACCEPTED,
            ],
        ).exists()

        if existing_request:
            raise serializers.ValidationError(
                "You already have an active request with this mentor."
            )

        return mentor

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "The request title cannot be empty."
            )

        return value

    def validate_message(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "The message cannot be empty."
            )

        return value

    def validate(self, attrs):
        request = self.context.get("request")

        if request and request.method == "POST":
            if "mentor" not in attrs:
                raise serializers.ValidationError(
                    {"mentor": "Please select an alumnus."}
                )

        return attrs


class NotificationSerializer(serializers.ModelSerializer):
    notification_type_display = serializers.CharField(
        source="get_notification_type_display",
        read_only=True,
    )

    class Meta:
        model = Notification

        fields = [
            "id",
            "title",
            "message",
            "notification_type",
            "notification_type_display",
            "mentorship_request",
            "is_read",
            "created_at",
        ]

        read_only_fields = fields