from django.db import models


class Project(models.Model):
    TYPE_CHOICES = [
        ('web', 'Web'),
        ('mobile', 'Mobile'),
        ('fullstack', 'Fullstack'),
    ]

    name = models.CharField(max_length=200)
    year = models.CharField(max_length=20)
    description = models.TextField()
    technologies = models.JSONField(default=list)
    features = models.JSONField(default=list)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='web')
    deployed = models.BooleanField(default=False)
    github_link = models.URLField(blank=True, null=True)
    demo_link = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=50, default='web')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('languages', 'Langages'),
        ('frameworks', 'Frameworks / Outils'),
    ]

    name = models.CharField(max_length=100)
    level = models.IntegerField()  # 0-100
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.category})"

    class Meta:
        ordering = ['-level']


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.subject}"

    class Meta:
        ordering = ['-created_at']


class LeaderboardEntry(models.Model):
    GAME_CHOICES = [
        ('snake', 'Snake'),
        ('quiz', 'Quiz Ivoirien'),
    ]

    game        = models.CharField(max_length=10, choices=GAME_CHOICES)
    player_name = models.CharField(max_length=50)
    score       = models.IntegerField(default=0)
    # Snake extras
    level       = models.IntegerField(default=1)
    # Quiz extras
    correct     = models.IntegerField(default=0)
    total       = models.IntegerField(default=0)
    duration    = models.IntegerField(default=0)  # seconds
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"[{self.game}] {self.player_name} — {self.score}"

    class Meta:
        ordering = ['-score', 'duration']
