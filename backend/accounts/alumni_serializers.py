from rest_framework import serializers

from .models import Profile


class AlumniSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(
        source="user.id",
        read_only=True
    )

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Profile

        fields = [
            "id",
            "user_id",
            "username",
            "full_name",
            "bio",
            "profile_picture",
            "institution",
            "department",
            "graduation_year",
            "company",
            "job_title",
            "industry",
            "skills",
            "is_available_for_mentorship",
        ]

        read_only_fields = fields

    def get_full_name(self, obj):
        full_name = obj.user.get_full_name().strip()

        if full_name:
            return full_name

        return obj.user.username