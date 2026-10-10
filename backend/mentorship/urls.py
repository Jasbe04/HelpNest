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
# Create a mentorship request
path(
"requests/",
MentorshipRequestCreateView.as_view(),
name="mentorship-request-create",
),


# Student's sent requests
path(
    "requests/sent/",
    SentMentorshipRequestsView.as_view(),
    name="mentorship-requests-sent",
),

# Alumni's received requests
path(
    "requests/received/",
    ReceivedMentorshipRequestsView.as_view(),
    name="mentorship-requests-received",
),

# View a single request
path(
    "requests/<int:pk>/",
    MentorshipRequestDetailView.as_view(),
    name="mentorship-request-detail",
),

# Accept or reject a request
path(
    "requests/<int:pk>/decision/",
    MentorshipRequestDecisionView.as_view(),
    name="mentorship-request-decision",
),

# Cancel a request
path(
    "requests/<int:pk>/cancel/",
    CancelMentorshipRequestView.as_view(),
    name="mentorship-request-cancel",
),

# List notifications
path(
    "notifications/",
    NotificationListView.as_view(),
    name="notification-list",
),

# Mark a notification as read
path(
    "notifications/<int:pk>/read/",
    MarkNotificationReadView.as_view(),
    name="notification-mark-read",
),


]
