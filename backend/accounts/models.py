from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class AccountType(models.TextChoices):
        STUDENT = "student", "Student"
        ALUMNI = "alumni", "Alumni"

    email = models.EmailField(unique=True)
    account_type = models.CharField(
        max_length=10,
        choices=AccountType.choices,
        default=AccountType.STUDENT,
    )

    def __str__(self):
        return self.email


class Profile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )


    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True,
    )
    institution = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=100, blank=True)
    graduation_year = models.PositiveIntegerField(blank=True, null=True)
    skills = models.TextField(
        blank=True,
        help_text="Enter skills separated by commas.",
    )

    current_term = models.CharField(
        max_length=100,
        blank=True,
        help_text="Current studying year or academic term.",
    )


    linkedin_url = models.URLField(blank=True)
    company = models.CharField(max_length=255, blank=True)
    job_title = models.CharField(max_length=255, blank=True)
    industry = models.CharField(max_length=100, blank=True)


    is_available_for_mentorship = models.BooleanField(default=False)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"