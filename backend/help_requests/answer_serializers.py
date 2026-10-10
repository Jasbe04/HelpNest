from rest_framework import serializers
from .models import Answer

class AnswerSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    
    class Meta:
        model = Answer
        fields = ['id', 'request', 'author', 'author_username', 'content', 'is_accepted', 'created_at', 'updated_at']
        read_only_fields = ['author', 'is_accepted']