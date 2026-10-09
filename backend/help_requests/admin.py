from django.contrib import admin
from .models import Category, HelpRequest, Answer

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}

@admin.register(HelpRequest)
class HelpRequestAdmin(admin.ModelAdmin):
    list_display = (
    "id",
    "title",
    "author",
    "category",
    "is_solved",
    "created_at",
    )


    list_filter = ("category", "is_solved", "created_at")
    search_fields = ("title", "description", "author__username")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = (
    "id",
    "request",
    "author",
    "is_accepted",
    "created_at",
    )


    list_filter = ("is_accepted", "created_at")
    search_fields = ("content", "author__username")
    readonly_fields = ("created_at", "updated_at")

