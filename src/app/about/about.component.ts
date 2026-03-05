import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('loaderAnim', [
      transition(':leave', [
        animate('600ms cubic-bezier(.77,0,.18,1)', style({ opacity: 0, transform: 'scale(1.05)' }))
      ])
    ])
  ]
})
export class AboutComponent {
  private sanitizer = inject(DomSanitizer);

  loading = signal(true);
  prefersReducedMotion = false;
  activeSkillTab = 'languages';
  skillsVisible = false;
  currentTrack = 0;

  tracks = [
    '3oTuTpF1F3A7rEC6RKsMRz',
    '59SNPmcXGLAMAmnUqQw2ZH',
    '6DH13QYXK7lKkYHSU88N48',
    '1XBYiRV30ykHw5f4wm6qEn',
    '3scdjQYPjXMQEmvEf0aXE7'
  ];

  trackUrls: SafeResourceUrl[] = [];

  programmingLanguages = [
    { name: 'HTML / CSS', level: 90 },
    { name: 'Python',     level: 85 },
    { name: 'JavaScript', level: 80 },
    { name: 'C',          level: 70 }
  ];

  frameworks = [
    { name: 'Git / GitHub', level: 80 },
    { name: 'Django',       level: 75 },
    { name: 'Flutter',      level: 70 },
    { name: 'Odoo',         level: 65 }
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    this.trackUrls = this.tracks.map(id =>
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`
      )
    );

    setTimeout(() => {
      this.loading.set(false);
      setTimeout(() => this.setupScrollAnimations(), 200);
    }, 1600);
  }

  nextTrack(): void {
    this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
  }

  prevTrack(): void {
    this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
  }

  getSkillGradient(level: number): string {
    if (level >= 80) return 'linear-gradient(90deg, var(--primary), var(--secondary))';
    if (level >= 60) return 'linear-gradient(90deg, var(--secondary), var(--accent))';
    return 'linear-gradient(90deg, var(--primary-light), var(--primary))';
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
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
            const el = entry.target as HTMLElement;
            el.style.transitionDelay = `${el.dataset['delay'] ?? '0'}ms`;
            el.classList.add('is-visible');
            if (el.classList.contains('skills-section')) {
              this.skillsVisible = true;
            }
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  }
}