from django.urls import path

from .views import (CategoryListView,HelpRequestListCreateView,HelpRequestDetailView,AnswerListCreateView,)    


urlpatterns = [
    path(
        "categories/",
        CategoryListView.as_view(),
        name="category-list",
    ),

    path(
        "help-requests/",
        HelpRequestListCreateView.as_view(),
        name="help-request-list-create",
    ),

    path(
        "help-requests/<int:pk>/",
        HelpRequestDetailView.as_view(),
        name="help-request-detail",
    ),

    path(
        "help-requests/<int:request_id>/answers/",
        AnswerListCreateView.as_view(),
        name="answer-list-create",
    ),
]