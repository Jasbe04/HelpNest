from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),

    # Account and authentication APIs
    path(
        "api/accounts/",
        include("accounts.urls"),
    ),
    path("api/mentorship/", 
        include("mentorship.urls")),

    # Help request APIs
    path(
        "api/",
        include("help_requests.urls"),
    ),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )