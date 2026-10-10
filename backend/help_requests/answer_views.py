from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Answer, HelpRequest
from .answer_serializers import AnswerSerializer


class AnswerListCreateAPIView(generics.ListCreateAPIView):
    """
    GET:
        List all answers for a help request.

    POST:
        Create a new answer for a help request.
    """

    serializer_class = AnswerSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAuthenticated()]

    def get_queryset(self):
        request_id = self.kwargs["request_id"]

        return Answer.objects.filter(
            request_id=request_id
        ).select_related(
            "author",
            "request"
        )

    def get(self, request, *args, **kwargs):
        # Make sure the help request exists.
        get_object_or_404(
            HelpRequest,
            pk=self.kwargs["request_id"]
        )

        return super().get(request, *args, **kwargs)

    def perform_create(self, serializer):
        # Get the help request from the URL.
        help_request = get_object_or_404(
            HelpRequest,
            pk=self.kwargs["request_id"]
        )

        # Automatically assign the request and logged-in author.
        serializer.save(
            request=help_request,
            author=self.request.user
        )


class AnswerDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET:
        Retrieve one answer.

    PUT/PATCH:
        Update your own answer.

    DELETE:
        Delete your own answer.
    """

    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Answer.objects.select_related(
            "author",
            "request"
        )

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)

        # Only the answer's author can edit or delete it.
        if request.method in ["PUT", "PATCH", "DELETE"]:
            if obj.author_id != request.user.id:
                raise PermissionDenied(
                    "You can only edit or delete your own answers."
                )


class AcceptAnswerAPIView(APIView):
    """
    The author of the help request can accept or unaccept
    an individual answer.

    Multiple answers can be accepted simultaneously.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        answer = get_object_or_404(
            Answer.objects.select_related("request"),
            pk=pk
        )

        # Only the person who created the help request
        # can accept or unaccept its answers.
        if answer.request.author_id != request.user.id:
            raise PermissionDenied(
                "Only the author of the help request "
                "can accept or unaccept answers."
            )

        # Toggle only this answer.
        # Other answers remain unchanged.
        answer.is_accepted = not answer.is_accepted

        answer.save(
            update_fields=["is_accepted", "updated_at"]
        )

        if answer.is_accepted:
            message = "Answer accepted successfully."
        else:
            message = "Answer unaccepted successfully."

        return Response(
            {
                "message": message,
                "answer": AnswerSerializer(answer).data,
            },
            status=status.HTTP_200_OK
        )