
from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegisterView,
    CurrentUserView,
    MyProfileView,
    AlumniListAPIView,
    AlumniDetailAPIView,  # Make sure to import your detail view here
)


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "me/",
        CurrentUserView.as_view(),
        name="current-user",
    ),

    path(
        "me/profile/",
        MyProfileView.as_view(),
        name="my-profile",
    ),

    path(
        "alumni/",
        AlumniListAPIView.as_view(),
        name="alumni-list",
    ),

    path(
        "alumni/<int:pk>/",
        AlumniDetailAPIView.as_view(),
        name="alumni-detail",
    ),
]





# from django.urls import path

# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

# from .views import (
#     RegisterView,
#     CurrentUserView,
#     MyProfileView,
#     AlumniListAPIView,
# )


# urlpatterns = [
#     path(
#         "register/",
#         RegisterView.as_view(),
#         name="register",
#     ),

#     path(
#         "token/",
#         TokenObtainPairView.as_view(),
#         name="token_obtain_pair",
#     ),

#     path(
#         "token/refresh/",
#         TokenRefreshView.as_view(),
#         name="token_refresh",
#     ),

#     path(
#         "me/",
#         CurrentUserView.as_view(),
#         name="current-user",
#     ),

#     path(
#         "me/profile/",
#         MyProfileView.as_view(),
#         name="my-profile",
#     ),
#     path(
#     "alumni/",
#     AlumniListAPIView.as_view(),
#     name="alumni-list"
#     ),
# ]