from django.db import models
from django.conf import settings


class MentorshipRequest(models.Model):

    class Topic(models.TextChoices):
        THESIS_RESEARCH = "thesis_research", "Thesis & Research"
        SCHOLARSHIP = "scholarship", "Scholarship & Higher Studies"
        CAREER = "career", "Career Planning"
        JOB = "job", "Job Preparation"
        INTERNSHIP = "internship", "Internship Opportunities"
        FREELANCING = "freelancing", "Freelancing"
        SOFTWARE = "software", "Software Development"
        AI_ML = "ai_ml", "Machine Learning & AI"
        ENTREPRENEURSHIP = "entrepreneurship", "Entrepreneurship"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    class CommunicationMethod(models.TextChoices):
        EMAIL = "email", "Email"
        LINKEDIN = "linkedin", "LinkedIn"

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_mentorship_requests"
    )

    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_mentorship_requests"
    )

    topic = models.CharField(
        max_length=30,
        choices=Topic.choices
    )

    title = models.CharField(max_length=200)

    message = models.TextField()

    specific_questions = models.TextField(blank=True)

    preferred_communication = models.CharField(
        max_length=20,
        choices=CommunicationMethod.choices,
        default=CommunicationMethod.EMAIL
    )

    preferred_availability = models.CharField(
        max_length=255,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"


class Notification(models.Model):

    class NotificationType(models.TextChoices):

        NEW_REQUEST = "new_request", "New Mentorship Request"
        REQUEST_ACCEPTED = "request_accepted", "Request Accepted"
        REQUEST_REJECTED = "request_rejected", "Request Rejected"
        REQUEST_CANCELLED = "request_cancelled", "Request Cancelled"


        NEW_ANSWER = "new_answer", "New Answer"
        ANSWER_ACCEPTED = "answer_accepted", "Answer Accepted"

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    title = models.CharField(max_length=200)

    message = models.TextField()

    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices
    )

    mentorship_request = models.ForeignKey(
        MentorshipRequest,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notifications"
    )

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.recipient.username}"