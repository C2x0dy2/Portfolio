import { Component, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApiService, Project } from '../api.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  animations: [
    trigger('loaderAnim', [
      transition(':leave', [
        animate('600ms cubic-bezier(.77,0,.18,1)', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ProjectsComponent {
  loading = signal(true);
  selectedCategory = signal<string>('all');
  private platformId = inject(PLATFORM_ID);
  private api = inject(ApiService);

  projects = signal<Project[]>([]);

  filteredProjects = computed(() => {
    const cat = this.selectedCategory();
    const all = this.projects();
    return cat === 'all' ? all : all.filter(p => p.category === cat);
  });

  constructor() {
    this.api.getProjects().subscribe({
      next: (projects) => this.projects.set(projects),
      error: () => {}
    });

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

  filterByCategory(category: string) {
    this.selectedCategory.set(category);
  }

  getTotalProjects(): number { return this.projects().length; }
  getWebProjects(): number { return this.projects().filter(p => p.type === 'web').length; }
  getMobileProjects(): number { return this.projects().filter(p => p.type === 'mobile').length; }
  getTechnologiesCount(): number {
    const allTechs = this.projects().flatMap(p => p.technologies);
    return new Set(allTechs).size;
  }
}
