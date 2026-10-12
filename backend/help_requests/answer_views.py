from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Answer, HelpRequest
from .answer_serializers import AnswerSerializer


class AnswerListCreateAPIView(generics.ListCreateAPIView):
    

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
     
        get_object_or_404(
            HelpRequest,
            pk=self.kwargs["request_id"]
        )

        return super().get(request, *args, **kwargs)

    def perform_create(self, serializer):
  
        help_request = get_object_or_404(
            HelpRequest,
            pk=self.kwargs["request_id"]
        )


        serializer.save(
            request=help_request,
            author=self.request.user
        )


class AnswerDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    

    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Answer.objects.select_related(
            "author",
            "request"
        )

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)

        if request.method in ["PUT", "PATCH", "DELETE"]:
            if obj.author_id != request.user.id:
                raise PermissionDenied(
                    "You can only edit or delete your own answers."
                )


class AcceptAnswerAPIView(APIView):
    

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        answer = get_object_or_404(
            Answer.objects.select_related("request"),
            pk=pk
        )

     
        if answer.request.author_id != request.user.id:
            raise PermissionDenied(
                "Only the author of the help request "
                "can accept or unaccept answers."
            )

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