import { Component, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  stagger 
} from '@angular/animations';

interface Project {
  id: number;
  name: string;
  year: string;
  description: string;
  technologies: string[];
  features: string[];
  type: 'web' | 'mobile' | 'fullstack';
  deployed: boolean;
  githubLink?: string;
  demoLink?: string;
  category: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  animations: [
    trigger('projectsAnim', [
      transition(':enter', [
        query('.projects-container > *', [
          style({ opacity: 0, transform: 'translateY(40px)' }),
          stagger(120, [
            animate('700ms cubic-bezier(.77,0,.18,1)', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('loaderAnim', [
      transition(':leave', [
        animate('600ms cubic-bezier(.77,0,.18,1)', style({ opacity: 0 }))
      ])
    ]),
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate('500ms cubic-bezier(.68,-0.55,.27,1.55)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ]),
    trigger('statAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('400ms cubic-bezier(.68,-0.55,.27,1.55)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ProjectsComponent {
  loading = signal(true);
  selectedCategory = signal<string>('all');
  private platformId = inject(PLATFORM_ID);

  // Liste complète des projets mise à jour
  projects: Project[] = [
    // Projets Web (HTML/CSS, Python, JavaScript)
    {
      id: 1,
      name: 'Feelshop',
      year: '2024-2025',
      description: 'Site e-commerce innovant qui se base sur les émotions de l\'utilisateur pour recommander des articles adaptés. Intègre également un blog communautaire où les utilisateurs peuvent créer et partager des articles.',
      technologies: ['Django', 'Python', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap'],
      features: [
        'Recommandations basées sur l\'humeur',
        'Blog avec création d\'articles',
        'Système de conseils communautaire',
        'Interface adaptative et responsive',
        'Base de données PostgreSQL'
      ],
      type: 'web',
      deployed: false,
      githubLink: 'https://github.com/divinedioulo/feelshop',
      category: 'web'
    },
    {
      id: 2,
      name: 'Sana',
      year: '2025-2026',
      description: 'Plateforme interactive pour l\'accompagnement psychologique. Vise à aider les utilisateurs dans leur bien-être mental à travers des outils numériques et des ressources adaptées.',
      technologies: ['Django', 'Python', 'JavaScript', 'HTML5', 'CSS3'],
      features: [
        'Accompagnement psychologique en ligne',
        'Ressources sur la santé mentale',
        'Exercices de bien-être interactifs',
        'Suivi personnalisé des utilisateurs',
        'Espace confidentiel'
      ],
      type: 'web',
      deployed: false,
      category: 'web'
    },
    {
      id: 3,
      name: 'E-Mindful',
      year: '2025-2026',
      description: 'Site de gestion pour l\'association Mindful Change Foundation. Développé pour faciliter la gestion des activités et améliorer la visibilité de l\'ONG.',
      technologies: ['Django', 'Python', 'HTML5', 'CSS3', 'JavaScript'],
      features: [
        'Gestion des activités associatives',
        'Portail de visibilité',
        'Digitalisation des processus',
        'Espace membres sécurisé',
        'Calendrier d\'événements'
      ],
      type: 'web',
      deployed: false,
      category: 'web'
    },
    {
      id: 4,
      name: 'Flowfleet',
      year: '2025-2026',
      description: 'Site de gestion de flotte automobile. Solution complète pour le suivi et la gestion d\'une flotte de véhicules.',
      technologies: ['Odoo', 'Python', 'HTML', 'CSS', 'PostgreSQL'],
      features: [
        'Gestion complète de flotte',
        'Suivi des véhicules en temps réel',
        'Planification d\'entretien',
        'Rapports et analyses',
        'Gestion des conducteurs'
      ],
      type: 'web',
      deployed: false,
      category: 'web'
    },
    {
      id: 5,
      name: 'Blog React',
      year: '2024-2025',
      description: 'Plateforme de blog moderne où les utilisateurs peuvent créer, partager et commenter des articles. Interface dynamique et réactive.',
      technologies: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Node.js'],
      features: [
        'Création et publication d\'articles',
        'Système de commentaires',
        'Catégorisation des articles',
        'Recherche avancée',
        'Interface responsive'
      ],
      type: 'web',
      deployed: false,
      githubLink: 'https://github.com/divinedioulo/react-blog',
      category: 'web'
    },
    {
      id: 6,
      name: 'Les Délices de Oli',
      year: '2024-2025',
      description: 'Site responsive de commande de repas pour les étudiants de l\'IIT. Permet de commander à manger en temps et en heure.',
      technologies: ['Java', 'JSP', 'Servlets', 'HTML5', 'CSS3', 'MySQL'],
      features: [
        'Commande de repas en ligne',
        'Gestion des horaires',
        'Paiement intégré',
        'Suivi des commandes en temps réel',
        'Interface mobile-first'
      ],
      type: 'web',
      deployed: false,
      category: 'web'
    },

    // Applications Mobile (Flutter)
    {
      id: 7,
      name: 'SwapiIt',
      year: '2023-2024',
      description: 'Application Flutter de vente d\'articles de seconde main. Permet aux utilisateurs de vendre leurs articles inutilisés pour générer des revenus et promouvoir le recyclage.',
      technologies: ['Flutter', 'Dart', 'Firebase', 'Provider'],
      features: [
        'Vente d\'articles de seconde main',
        'Publication d\'annonces avec photos',
        'Messagerie intégrée en temps réel',
        'Système de paiement sécurisé',
        'Géolocalisation des articles'
      ],
      type: 'mobile',
      deployed: false,
      githubLink: 'https://github.com/divinedioulo/swapiit',
      category: 'mobile'
    },
    {
      id: 8,
      name: 'Mindcare',
      year: '2024-2025',
      description: 'Application Flutter pour le suivi psychologique. Conçue pour aider les utilisateurs à suivre leur bien-être mental au quotidien avec des outils interactifs.',
      technologies: ['Flutter', 'Dart', 'Firebase', 'Provider', 'Charts'],
      features: [
        'Suivi quotidien de l\'humeur',
        'Journal des émotions',
        'Statistiques et graphiques d\'évolution',
        'Exercices de respiration guidés',
        'Rappels personnalisés'
      ],
      type: 'mobile',
      deployed: false,
      githubLink: 'https://github.com/divinedioulo/mindcare',
      category: 'mobile'
    }
  ];

  // Projets filtrés par catégorie
  filteredProjects = computed(() => {
    if (this.selectedCategory() === 'all') {
      return this.projects;
    }
    return this.projects.filter(p => p.category === this.selectedCategory());
  });

  constructor() {
    setTimeout(() => {
      this.loading.set(false);
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.setupScrollAnimations(), 150);
      }
    }, 1600);
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.sr').forEach(el => observer.observe(el));
  }

  // Méthodes de filtrage
  filterByCategory(category: string) {
    this.selectedCategory.set(category);
  }

  // Statistiques
  getTotalProjects(): number {
    return this.projects.length;
  }

  getWebProjects(): number {
    return this.projects.filter(p => p.type === 'web').length;
  }

  getMobileProjects(): number {
    return this.projects.filter(p => p.type === 'mobile').length;
  }

  getTechnologiesCount(): number {
    const allTechs = this.projects.flatMap(p => p.technologies);
    return new Set(allTechs).size;
  }

  // Couleurs pour les technologies
  getTechColor(tech: string): string {
    const colors: { [key: string]: string } = {
      'Django': 'linear-gradient(135deg, #092E20, #0C4B33)',
      'Python': 'linear-gradient(135deg, #306998, #FFE873)',
      'JavaScript': 'linear-gradient(135deg, #F7DF1E, #F0DB4F)',
      'HTML5': 'linear-gradient(135deg, #E44D26, #F16529)',
      'CSS3': 'linear-gradient(135deg, #264DE4, #2965F1)',
      'Flutter': 'linear-gradient(135deg, #0468D7, #02569B)',
      'Dart': 'linear-gradient(135deg, #0175C2, #13B9FD)',
      'Firebase': 'linear-gradient(135deg, #FFCA28, #F5820D)',
      'React': 'linear-gradient(135deg, #61DAFB, #20232A)',
      'Java': 'linear-gradient(135deg, #007396, #E76F00)',
      'Odoo': 'linear-gradient(135deg, #714B67, #8F5E8A)',
      'Bootstrap': 'linear-gradient(135deg, #7952B3, #563D7C)',
      'MySQL': 'linear-gradient(135deg, #4479A1, #F29111)',
      'Node.js': 'linear-gradient(135deg, #339933, #026E00)',
      'Angular': 'linear-gradient(135deg, #DD0031, #C3002F)'
    };
    return colors[tech] || 'linear-gradient(135deg, var(--primary), var(--secondary))';
  }

  // Gradient pour les icônes de projet
  getProjectGradient(type: string): string {
    const gradients: Record<string, string> = {
      'web': 'linear-gradient(135deg, #3B82F6, #0EA5E9)',
      'mobile': 'linear-gradient(135deg, #8B5CF6, #6366F1)',
      'fullstack': 'linear-gradient(135deg, #10B981, #14B8A6)'
    };
    return gradients[type] || gradients['web'];
  }

  // Emoji pour le type de projet
  getProjectEmoji(type: string): string {
    const emojis: Record<string, string> = {
      'web': '🌐',
      'mobile': '📱',
      'fullstack': '⚡'
    };
    return emojis[type] || '💻';
  }
}