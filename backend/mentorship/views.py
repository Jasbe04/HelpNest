from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import MentorshipRequest, Notification
from .serializers import (
    MentorshipRequestSerializer,
    NotificationSerializer,
)


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, "account_type", None) == "student"
        )


class IsAlumni(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and getattr(request.user, "account_type", None) == "alumni"
        )


class MentorshipRequestCreateView(generics.CreateAPIView):
    serializer_class = MentorshipRequestSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsStudent,
    ]

    def perform_create(self, serializer):
        mentorship_request = serializer.save(
            student=self.request.user
        )

        student = mentorship_request.student
        student_name = student.get_full_name() or student.username

        Notification.objects.create(
            recipient=mentorship_request.mentor,
            title="New Mentorship Request",
            message=(
                f"{student_name} has sent you a mentorship request "
                f"about {mentorship_request.get_topic_display()}."
            ),
            notification_type=Notification.NotificationType.NEW_REQUEST,
            mentorship_request=mentorship_request,
        )


class SentMentorshipRequestsView(generics.ListAPIView):
    serializer_class = MentorshipRequestSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsStudent,
    ]

    def get_queryset(self):
        return MentorshipRequest.objects.filter(
            student=self.request.user
        ).select_related(
            "student",
            "mentor",
        )


class ReceivedMentorshipRequestsView(generics.ListAPIView):
    serializer_class = MentorshipRequestSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsAlumni,
    ]

    def get_queryset(self):
        return MentorshipRequest.objects.filter(
            mentor=self.request.user
        ).select_related(
            "student",
            "mentor",
        )


class MentorshipRequestDetailView(generics.RetrieveAPIView):
    serializer_class = MentorshipRequestSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_queryset(self):
        user = self.request.user
        # Fixed: using Q objects instead of .union() to support pk lookups cleanly
        return MentorshipRequest.objects.filter(
            Q(student=user) | Q(mentor=user)
        ).select_related(
            "student",
            "mentor",
        )


class MentorshipRequestDecisionView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsAlumni,
    ]

    def post(self, request, pk):
        decision = request.data.get("decision")

        if decision not in [
            MentorshipRequest.Status.ACCEPTED,
            MentorshipRequest.Status.REJECTED,
        ]:
            raise ValidationError({
                "decision": "Choose 'accepted' or 'rejected'."
            })

        with transaction.atomic():
            mentorship_request = get_object_or_404(
                MentorshipRequest.objects.select_for_update(),
                pk=pk,
                mentor=request.user,
            )

            if (
                mentorship_request.status
                != MentorshipRequest.Status.PENDING
            ):
                raise ValidationError(
                    "Only pending requests can be accepted or rejected."
                )

            mentorship_request.status = decision

            mentorship_request.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            mentor = mentorship_request.mentor
            mentor_name = mentor.get_full_name() or mentor.username

            if decision == MentorshipRequest.Status.ACCEPTED:
                message = (
                    f"{mentor_name} has accepted your mentorship request "
                    f"about {mentorship_request.get_topic_display()}."
                )

                try:
                    profile = mentor.profile
                    linkedin_url = profile.linkedin_url
                except Exception:
                    linkedin_url = ""

                contact_details = ""

                if mentor.email:
                    contact_details += f"\nMentor email: {mentor.email}"

                if linkedin_url:
                    contact_details += f"\nMentor LinkedIn: {linkedin_url}"

                if contact_details:
                    message += (
                        "\n\nContact details:"
                        f"{contact_details}"
                    )

                message += (
                    "\n\nYou can now contact your mentor "
                    "to arrange a meeting."
                )

                notification_type = (
                    Notification.NotificationType.REQUEST_ACCEPTED
                )

                title = "Mentorship Request Accepted"

            else:
                message = (
                    f"{mentor_name} has declined your mentorship request "
                    f"about {mentorship_request.get_topic_display()}."
                )

                notification_type = (
                    Notification.NotificationType.REQUEST_REJECTED
                )

                title = "Mentorship Request Rejected"

            Notification.objects.create(
                recipient=mentorship_request.student,
                title=title,
                message=message,
                notification_type=notification_type,
                mentorship_request=mentorship_request,
            )

        return Response(
            {
                "message": f"Request {decision} successfully.",
                "request": MentorshipRequestSerializer(
                    mentorship_request,
                    context={"request": request},
                ).data,
            },
            status=status.HTTP_200_OK,
        )


class CancelMentorshipRequestView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsStudent,
    ]

    def post(self, request, pk):
        with transaction.atomic():
            mentorship_request = get_object_or_404(
                MentorshipRequest.objects.select_for_update(),
                pk=pk,
                student=request.user,
            )

            if (
                mentorship_request.status
                != MentorshipRequest.Status.PENDING
            ):
                raise ValidationError(
                    "Only pending requests can be cancelled."
                )

            mentorship_request.status = (
                MentorshipRequest.Status.CANCELLED
            )

            mentorship_request.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            student = request.user
            student_name = student.get_full_name() or student.username

            Notification.objects.create(
                recipient=mentorship_request.mentor,
                title="Mentorship Request Cancelled",
                message=(
                    f"{student_name} has cancelled their "
                    "mentorship request."
                ),
                notification_type=(
                    Notification.NotificationType.REQUEST_CANCELLED
                ),
                mentorship_request=mentorship_request,
            )

        return Response(
            {
                "message": "Mentorship request cancelled successfully."
            },
            status=status.HTTP_200_OK,
        )


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        ).select_related(
            "mentorship_request",
        )


class MarkNotificationReadView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def post(self, request, pk):
        notification = get_object_or_404(
            Notification,
            pk=pk,
            recipient=request.user,
        )

        if not notification.is_read:
            notification.is_read = True

            notification.save(
                update_fields=["is_read"]
            )

        return Response(
            {
                "message": "Notification marked as read."
            },
            status=status.HTTP_200_OK,
        )