from rest_framework import serializers
from .models import Category, HelpRequest, Answer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class AnswerSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(
        source="author.username",
        read_only=True
    )

    author_id = serializers.IntegerField(
        source="author.id",
        read_only=True
    )

    class Meta:
        model = Answer

        fields = [
            "id",
            "request",
            "author",
            "author_id",
            "author_username",
            "content",
            "is_accepted",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "request",
            "author",
            "author_id",
            "author_username",
            "is_accepted",
            "created_at",
            "updated_at",
        ]

    def validate_content(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Answer cannot be empty."
            )

        return value

class HelpRequestSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(
        source="author.username",
        read_only=True
    )

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = HelpRequest
        fields = [
            "id",
            "author",
            "author_username",
            "category",
            "category_name",
            "title",
            "description",
            "is_solved",
            "answers",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "author",
            "is_solved",
            "answers",
            "created_at",
            "updated_at",
        ]