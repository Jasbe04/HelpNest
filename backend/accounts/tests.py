from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Profile


User = get_user_model()


class AccountAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="StrongDemoPassword123!",
        )

        self.profile = Profile.objects.get_or_create(
            user=self.user
        )[0]

    def test_user_can_register(self):
        url = reverse("register")

        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "AnotherStrongPassword123!",
            "password2": "AnotherStrongPassword123!",
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        new_user = User.objects.get(username="newuser")

        self.assertTrue(
            new_user.check_password(
                "AnotherStrongPassword123!"
            )
        )

        self.assertTrue(
            Profile.objects.filter(user=new_user).exists()
        )

    def test_registration_rejects_mismatched_passwords(self):
        url = reverse("register")

        data = {
            "username": "invaliduser",
            "email": "invalid@example.com",
            "password": "StrongPassword123!",
            "password2": "DifferentPassword123!",
        }

        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_login_returns_jwt_tokens(self):
        url = reverse("token_obtain_pair")

        response = self.client.post(
            url,
            {
                "username": "testuser",
                "password": "StrongDemoPassword123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_current_user_requires_authentication(self):
        url = reverse("current-user")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_authenticated_user_can_view_own_profile(self):
        self.client.force_authenticate(user=self.user)

        url = reverse("my-profile")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["username"],
            self.user.username,
        )

    def test_authenticated_user_can_update_own_profile(self):
        self.client.force_authenticate(user=self.user)

        url = reverse("my-profile")

        response = self.client.patch(
            url,
            {
                "bio": "I am learning Django REST Framework.",
                "is_available_for_mentorship": True,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.profile.refresh_from_db()

        self.assertEqual(
            self.profile.bio,
            "I am learning Django REST Framework.",
        )

        self.assertTrue(
            self.profile.is_available_for_mentorship
        )