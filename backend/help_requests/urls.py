from django.urls import path

from .views import (CategoryListView,HelpRequestListCreateView,HelpRequestDetailView,AnswerListCreateView,)    
from .answer_views import (
    AnswerListCreateAPIView,
    AnswerDetailAPIView,
    AcceptAnswerAPIView,
)

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


    path(
        "help-requests/<int:request_id>/answers/",
        AnswerListCreateAPIView.as_view(),
        name="answer-list-create",
    ),


    path(
        "answers/<int:pk>/",
        AnswerDetailAPIView.as_view(),
        name="answer-detail",
    ),


    path(
        "answers/<int:pk>/accept/",
        AcceptAnswerAPIView.as_view(),
        name="answer-accept",
    ),
]