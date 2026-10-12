from django.urls import path

from .views import (
MentorshipRequestCreateView,
SentMentorshipRequestsView,
ReceivedMentorshipRequestsView,
MentorshipRequestDetailView,
MentorshipRequestDecisionView,
CancelMentorshipRequestView,
NotificationListView,
MarkNotificationReadView,
)

urlpatterns = [

path(
"requests/",
MentorshipRequestCreateView.as_view(),
name="mentorship-request-create",
),



path(
    "requests/sent/",
    SentMentorshipRequestsView.as_view(),
    name="mentorship-requests-sent",
),


path(
    "requests/received/",
    ReceivedMentorshipRequestsView.as_view(),
    name="mentorship-requests-received",
),


path(
    "requests/<int:pk>/",
    MentorshipRequestDetailView.as_view(),
    name="mentorship-request-detail",
),


path(
    "requests/<int:pk>/decision/",
    MentorshipRequestDecisionView.as_view(),
    name="mentorship-request-decision",
),


path(
    "requests/<int:pk>/cancel/",
    CancelMentorshipRequestView.as_view(),
    name="mentorship-request-cancel",
),


path(
    "notifications/",
    NotificationListView.as_view(),
    name="notification-list",
),


path(
    "notifications/<int:pk>/read/",
    MarkNotificationReadView.as_view(),
    name="notification-mark-read",
),


]
