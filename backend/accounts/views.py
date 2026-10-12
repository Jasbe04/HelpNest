from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.parsers import (
    FormParser,
    JSONParser,
    MultiPartParser,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .alumni_serializers import AlumniSerializer
from .models import Profile
from .serializers import (
    CurrentUserSerializer,
    ProfileSerializer,
    RegisterSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)


class MyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(
            user=self.request.user
        )
        return profile


class AlumniListAPIView(generics.ListAPIView):
    

    serializer_class = AlumniSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Profile.objects.filter(
            user__account_type="alumni"
        ).select_related("user")


        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
                | Q(company__icontains=search)
                | Q(job_title__icontains=search)
                | Q(skills__icontains=search)
            )


        industry = self.request.query_params.get("industry", "").strip()
        if industry:
            queryset = queryset.filter(industry__iexact=industry)

        company = self.request.query_params.get("company", "").strip()
        if company:
            queryset = queryset.filter(company__icontains=company)


        mentorship = (
            self.request.query_params.get("mentorship", "").strip().lower()
        )
        if mentorship in ["true", "false"]:
            queryset = queryset.filter(
                is_available_for_mentorship=(mentorship == "true")
            )

        return queryset.order_by("user__first_name", "user__username")


class AlumniDetailAPIView(generics.RetrieveAPIView):
    

    serializer_class = AlumniSerializer
    permission_classes = [AllowAny]
    queryset = Profile.objects.filter(
        user__account_type="alumni"
    ).select_related("user")

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        pk = self.kwargs.get("pk")


        obj = get_object_or_404(
            queryset, Q(pk=pk) | Q(user__id=pk)
        )

        self.check_object_permissions(self.request, obj)
        return obj