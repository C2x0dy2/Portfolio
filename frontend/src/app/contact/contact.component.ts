import { Component, signal, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  animations: [
    trigger('loaderAnim', [
      transition(':leave', [
        animate('600ms cubic-bezier(.77,0,.18,1)', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('600ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('socialHover', [
      transition(':enter', [
        style({ opacity: 0, scale: 0.8 }),
        animate('300ms ease-out', style({ opacity: 1, scale: 1 }))
      ])
    ])
  ]
})
export class ContactComponent implements AfterViewInit {
  loading = signal(true);
  isSubmitting = false;
  showSuccess = false;
  
  formData = { name: '', email: '', subject: '', message: '' };

  socialLinks = {
    linkedin: 'https://www.linkedin.com/in/dioulo-divine-yoboukoi-800b96372/',
    github: 'https://github.com/C2x0dy2',
    instagram: 'https://www.instagram.com/c2x0dy/',
    facebook: 'https://www.facebook.com/profile.php?id=61574855326266',
    whatsapp: 'https://wa.me/2250143829494',
    email: 'divineyoboukoi2005@gmail.com',
    phone: '+2250143829494'
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: ApiService
  ) {
    setTimeout(() => {
      this.loading.set(false);
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.setupScrollAnimations(), 200);
      }
    }, 1600);
  }

  ngAfterViewInit() {}

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.sr').forEach(el => observer.observe(el));
  }

  onSubmit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isSubmitting = true;

    this.api.sendContact(this.formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showSuccess = true;
        this.formData = { name: '', email: '', subject: '', message: '' };
        setTimeout(() => { this.showSuccess = false; }, 5000);
      },
      error: () => {
        // Fallback mailto si backend off
        const subject = encodeURIComponent(this.formData.subject);
        const body = encodeURIComponent(`Nom: ${this.formData.name}\nEmail: ${this.formData.email}\n\n${this.formData.message}`);
        window.location.href = `mailto:${this.socialLinks.email}?subject=${subject}&body=${body}`;
        this.isSubmitting = false;
      }
    });
  }

  // Méthodes pour ouvrir les liens (alternative si besoin)
  openLink(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank');
    }
  }

  openWhatsApp() {
    if (isPlatformBrowser(this.platformId)) {
      window.open(this.socialLinks.whatsapp, '_blank');
    }
  }

  sendEmail() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = `mailto:${this.socialLinks.email}`;
    }
  }
}