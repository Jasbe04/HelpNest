from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Category, HelpRequest, Answer
from .serializers import (CategorySerializer,HelpRequestSerializer,AnswerSerializer,)
    
    
    



class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class HelpRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = HelpRequestSerializer

    def get_queryset(self):
        queryset = HelpRequest.objects.select_related(
            "author",
            "category",
        ).prefetch_related("answers__author")

        category_slug = self.request.query_params.get("category")
        is_solved = self.request.query_params.get("is_solved")

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        if is_solved is not None:
            if is_solved.lower() in ("true", "false"):
                queryset = queryset.filter(
                    is_solved=(is_solved.lower() == "true")
                )

        return queryset

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class HelpRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HelpRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return HelpRequest.objects.select_related(
            "author",
            "category",
        ).prefetch_related("answers__author")

    def perform_update(self, serializer):
        if self.get_object().author != self.request.user:
            raise PermissionDenied(
                "You can only update your own help requests."
            )

        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied(
                "You can only delete your own help requests."
            )

        instance.delete()


class AnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer

    def get_request_object(self):
        return get_object_or_404(
            HelpRequest,
            pk=self.kwargs["request_id"]
        )

    def get_queryset(self):
        help_request = self.get_request_object()

        return Answer.objects.filter(
            request=help_request
        ).select_related("author")

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        help_request = self.get_request_object()

        if help_request.is_solved:
            raise PermissionDenied(
                "You cannot answer a solved help request."
            )

        serializer.save(
            request=help_request,
            author=self.request.user,
        )