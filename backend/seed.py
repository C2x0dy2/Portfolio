"""
Seed the database with data from the Angular frontend.
Run: python seed.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio.settings')
django.setup()

from api.models import Project, Skill, ContactMessage

# --- Clear existing ---
Project.objects.all().delete()
Skill.objects.all().delete()

# --- Projects ---
projects = [
    {
        "name": "Feelshop",
        "year": "2024-2025",
        "description": "Site e-commerce innovant qui se base sur les émotions de l'utilisateur pour recommander des articles adaptés. Intègre également un blog communautaire où les utilisateurs peuvent créer et partager des articles.",
        "technologies": ["Django", "Python", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
        "features": ["Recommandations basées sur l'humeur", "Blog avec création d'articles", "Système de conseils communautaire", "Interface adaptative et responsive", "Base de données PostgreSQL"],
        "type": "web",
        "deployed": False,
        "github_link": "https://github.com/divinedioulo/feelshop",
        "demo_link": None,
        "category": "web"
    },
    {
        "name": "Sana",
        "year": "2025-2026",
        "description": "Plateforme interactive pour l'accompagnement psychologique. Vise à aider les utilisateurs dans leur bien-être mental à travers des outils numériques et des ressources adaptées.",
        "technologies": ["Django", "Python", "JavaScript", "HTML5", "CSS3"],
        "features": ["Accompagnement psychologique en ligne", "Ressources sur la santé mentale", "Exercices de bien-être interactifs", "Suivi personnalisé des utilisateurs", "Espace confidentiel"],
        "type": "web",
        "deployed": False,
        "github_link": None,
        "demo_link": None,
        "category": "web"
    },
    {
        "name": "E-Mindful",
        "year": "2025-2026",
        "description": "Site de gestion pour l'association Mindful Change Foundation. Développé pour faciliter la gestion des activités et améliorer la visibilité de l'ONG.",
        "technologies": ["Django", "Python", "HTML5", "CSS3", "JavaScript"],
        "features": ["Gestion des activités associatives", "Portail de visibilité", "Digitalisation des processus", "Espace membres sécurisé", "Calendrier d'événements"],
        "type": "web",
        "deployed": False,
        "github_link": None,
        "demo_link": None,
        "category": "web"
    },
    {
        "name": "Flowfleet",
        "year": "2025-2026",
        "description": "Site de gestion de flotte automobile. Solution complète pour le suivi et la gestion d'une flotte de véhicules.",
        "technologies": ["Odoo", "Python", "HTML", "CSS", "PostgreSQL"],
        "features": ["Gestion complète de flotte", "Suivi des véhicules en temps réel", "Planification d'entretien", "Rapports et analyses", "Gestion des conducteurs"],
        "type": "web",
        "deployed": False,
        "github_link": None,
        "demo_link": None,
        "category": "web"
    },
    {
        "name": "Blog React",
        "year": "2024-2025",
        "description": "Plateforme de blog moderne où les utilisateurs peuvent créer, partager et commenter des articles. Interface dynamique et réactive.",
        "technologies": ["React", "JavaScript", "HTML5", "CSS3", "Node.js"],
        "features": ["Création et publication d'articles", "Système de commentaires", "Catégorisation des articles", "Recherche avancée", "Interface responsive"],
        "type": "web",
        "deployed": False,
        "github_link": "https://github.com/divinedioulo/react-blog",
        "demo_link": None,
        "category": "web"
    },
    {
        "name": "Les Délices de Oli",
        "year": "2024-2025",
        "description": "Site responsive de commande de repas pour les étudiants de l'IIT. Permet de commander à manger en temps et en heure.",
        "technologies": ["Java", "JSP", "Servlets", "HTML5", "CSS3", "MySQL"],
        "features": ["Commande de repas en ligne", "Gestion des horaires", "Paiement intégré", "Suivi des commandes en temps réel", "Interface mobile-first"],
        "type": "web",
        "deployed": False,
        "github_link": None,
        "demo_link": None,
        "category": "web"
    },
    {
        "name": "SwapiIt",
        "year": "2023-2024",
        "description": "Application Flutter de vente d'articles de seconde main. Permet aux utilisateurs de vendre leurs articles inutilisés pour générer des revenus et promouvoir le recyclage.",
        "technologies": ["Flutter", "Dart", "Firebase", "Provider"],
        "features": ["Vente d'articles de seconde main", "Publication d'annonces avec photos", "Messagerie intégrée en temps réel", "Système de paiement sécurisé", "Géolocalisation des articles"],
        "type": "mobile",
        "deployed": False,
        "github_link": "https://github.com/divinedioulo/swapiit",
        "demo_link": None,
        "category": "mobile"
    },
    {
        "name": "Mindcare",
        "year": "2024-2025",
        "description": "Application Flutter pour le suivi psychologique. Conçue pour aider les utilisateurs à suivre leur bien-être mental au quotidien avec des outils interactifs.",
        "technologies": ["Flutter", "Dart", "Firebase", "Provider", "Charts"],
        "features": ["Suivi quotidien de l'humeur", "Journal des émotions", "Statistiques et graphiques d'évolution", "Exercices de respiration guidés", "Rappels personnalisés"],
        "type": "mobile",
        "deployed": False,
        "github_link": "https://github.com/divinedioulo/mindcare",
        "demo_link": None,
        "category": "mobile"
    },
]

for p in projects:
    Project.objects.create(**p)

print(f"✓ {Project.objects.count()} projets créés")

# --- Skills ---
skills = [
    # Languages
    {"name": "HTML / CSS",  "level": 90, "category": "languages"},
    {"name": "Python",      "level": 85, "category": "languages"},
    {"name": "JavaScript",  "level": 80, "category": "languages"},
    {"name": "C",           "level": 70, "category": "languages"},
    # Frameworks / Tools
    {"name": "Git / GitHub","level": 80, "category": "frameworks"},
    {"name": "Django",      "level": 75, "category": "frameworks"},
    {"name": "Flutter",     "level": 70, "category": "frameworks"},
    {"name": "Odoo",        "level": 65, "category": "frameworks"},
]

for s in skills:
    Skill.objects.create(**s)

print(f"✓ {Skill.objects.count()} skills créés")
print("\nBase de données peuplée avec succès !")
