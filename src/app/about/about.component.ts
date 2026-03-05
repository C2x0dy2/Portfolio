import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  stagger,
  keyframes 
} from '@angular/animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('aboutAnim', [
      transition(':enter', [
        query('.about-container > *', [
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
        style({ opacity: 0, scale: 0.8, transform: 'translateY(20px)' }),
        animate('400ms cubic-bezier(.68,-0.55,.27,1.55)', 
          style({ opacity: 1, scale: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('timelineAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('skillAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('cardHoverAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('textAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AboutComponent {
  loading = signal(true);
  prefersReducedMotion = false;

  // Données pour les compétences
  programmingLanguages = [
    { name: 'Python', level: 85 },
    { name: 'JavaScript', level: 80 },
    { name: 'HTML/CSS', level: 90 },
    { name: 'C', level: 70 }
  ];

  frameworks = [
    { name: 'Django', level: 75 },
    { name: 'Flutter', level: 70 },
    { name: 'Odoo', level: 65 },
    { name: 'Git/GitHub', level: 80 }
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    // Simulation du chargement
    setTimeout(() => {
      this.loading.set(false);
      setTimeout(() => this.setupScrollAnimations(), 200);
    }, 1600);
  }

  getSkillGradient(level: number): string {
    if (level >= 80) {
      return 'linear-gradient(90deg, var(--primary), var(--secondary))';
    } else if (level >= 60) {
      return 'linear-gradient(90deg, var(--secondary), var(--accent))';
    } else {
      return 'linear-gradient(90deg, var(--primary-light), var(--primary))';
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // Créer un fallback avec les initiales
    const parent = img.parentElement;
    if (parent) {
      const fallback = document.createElement('div');
      fallback.className = 'image-fallback';
      fallback.textContent = 'DD';
      parent.appendChild(fallback);
    }
  }

  setupScrollAnimations(): void {
    if (typeof window === 'undefined' || this.prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = (entry.target as HTMLElement).dataset['delay'] || '0';
            (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.scroll-reveal')
      .forEach(el => observer.observe(el));
  }
}