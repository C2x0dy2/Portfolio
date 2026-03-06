from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, Skill, ContactMessage, LeaderboardEntry
from .serializers import (
    ProjectSerializer, SkillSerializer,
    ContactMessageSerializer, LeaderboardEntrySerializer
)


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category and category != 'all':
            qs = qs.filter(category=category)
        return qs


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    http_method_names = ['post', 'head', 'options']


class LeaderboardViewSet(viewsets.ViewSet):
    """
    GET  /api/leaderboard/?game=snake   → liste triée par score décroissant
    POST /api/leaderboard/submit/        → crée ou met à jour le meilleur score du joueur
    """

    def list(self, request):
        game = request.query_params.get('game')
        if not game or game not in ('snake', 'quiz'):
            return Response(
                {'error': 'Paramètre game requis : snake ou quiz'},
                status=status.HTTP_400_BAD_REQUEST
            )
        entries = LeaderboardEntry.objects.filter(game=game).order_by('-score', 'duration')
        serializer = LeaderboardEntrySerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='submit')
    def submit(self, request):
        game = request.data.get('game')
        player_name = str(request.data.get('player_name', '')).strip()[:50]
        score = int(request.data.get('score', 0))

        if not game or game not in ('snake', 'quiz'):
            return Response(
                {'error': 'Champ game requis : snake ou quiz'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not player_name:
            return Response(
                {'error': 'Champ player_name requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Upsert : garde uniquement le meilleur score par joueur+jeu
        entry, created = LeaderboardEntry.objects.get_or_create(
            game=game,
            player_name__iexact=player_name,
            defaults={'player_name': player_name, 'score': score}
        )

        if not created and score > entry.score:
            entry.score    = score
            entry.level    = int(request.data.get('level', entry.level))
            entry.correct  = int(request.data.get('correct', entry.correct))
            entry.total    = int(request.data.get('total', entry.total))
            entry.duration = int(request.data.get('duration', entry.duration))
            entry.save()
        elif created:
            entry.level    = int(request.data.get('level', 1))
            entry.correct  = int(request.data.get('correct', 0))
            entry.total    = int(request.data.get('total', 0))
            entry.duration = int(request.data.get('duration', 0))
            entry.save()

        serializer = LeaderboardEntrySerializer(entry)
        return Response(serializer.data, status=status.HTTP_200_OK)
