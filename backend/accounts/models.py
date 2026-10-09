from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)


    def __str__(self):
        return self.email


class Profile(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE, related_name="profile")
    
    bio = models.TextField(blank=True)

    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True
    )

    institution = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=255, blank=True)
    graduation_year = models.PositiveIntegerField(blank=True, null=True)

    company = models.CharField(max_length=255, blank=True)
    job_title = models.CharField(max_length=255, blank=True)
    industry = models.CharField(max_length=100, blank=True)

    skills = models.TextField(
        blank=True,
        help_text="Enter skills separated by commas."
    )

    is_available_for_mentorship = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

