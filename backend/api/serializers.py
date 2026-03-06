from rest_framework import serializers
from .models import Project, Skill, ContactMessage, LeaderboardEntry


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = ['id', 'game', 'player_name', 'score', 'level',
                  'correct', 'total', 'duration', 'updated_at']
        read_only_fields = ['id', 'updated_at']
