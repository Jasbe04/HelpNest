from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction

from rest_framework import serializers

from .models import Profile


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={"input_type": "password"},
    )

    password2 = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "account_type",  # <-- Added account_type for registration choice
            "password",
            "password2",
        ]
        read_only_fields = ["id"]

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Username cannot be empty."
            )

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({
                "password2": "The passwords do not match."
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )

        Profile.objects.get_or_create(user=user)

        return user


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "account_type",  # <-- Added account_type
            "date_joined",
        ]
        read_only_fields = fields


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    account_type = serializers.CharField(
        source="user.account_type",
        read_only=True,
    )

    class Meta:
        model = Profile
        fields = [
            "id",
            "username",
            "email",
            "account_type",
            "bio",
            "profile_picture",
            "institution",
            "department",
            "graduation_year",
            "current_term",
            "company",
            "job_title",
            "industry",
            "skills",
            "is_available_for_mentorship",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
            "account_type",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        user = self.instance.user if self.instance else None

        # Enforce Student vs Alumni update permissions
        if user and user.account_type == "student":
            restricted_fields = {
                "company": "Students are not allowed to update company information.",
                "job_title": "Students are not allowed to update job title.",
                "industry": "Students are not allowed to update industry.",
                "is_available_for_mentorship": "Students cannot enable mentorship availability.",
            }

            for field, message in restricted_fields.items():
                if field in attrs:
                    value = attrs[field]
                    # Block if they provide a non-empty/active value for restricted fields
                    if value not in [None, "", False]:
                        raise serializers.ValidationError({field: message})

        return attrs