import { Component, signal, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  trigger, 
  transition, 
  style, 
  animate 
} from '@angular/animations';

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
  
  // Données du formulaire
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  // Liens sociaux
  socialLinks = {
    linkedin: 'https://www.linkedin.com/in/dioulo-divine-yoboukoi-800b96372/',
    github: 'https://github.com/C2x0dy2',
    instagram: 'https://www.instagram.com/c2x0dy/',
    facebook: 'https://www.facebook.com/profile.php?id=61574855326266',
    whatsapp: 'https://wa.me/2250143829494',
    email: 'divineyoboukoi2005@gmail.com',
    phone: '+2250143829494'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    setTimeout(() => {
      this.loading.set(false);
      if (isPlatformBrowser(this.platformId)) {
        // wait for *ngIf to render the section
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

  // Méthode appelée à la soumission du formulaire
  onSubmit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSubmitting = true;

      // Construction du mailto avec les données du formulaire
      const subject = encodeURIComponent(this.formData.subject);
      const body = encodeURIComponent(
        `Nom: ${this.formData.name}\n` +
        `Email: ${this.formData.email}\n\n` +
        `Message:\n${this.formData.message}`
      );

      const mailtoLink = `mailto:${this.socialLinks.email}?subject=${subject}&body=${body}`;

      // Ouvrir le client mail par défaut
      window.location.href = mailtoLink;

      // Simuler l'envoi (dans un cas réel, tu ferais un appel API)
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccess = true;
        
        // Réinitialiser le formulaire
        this.formData = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };

        // Cacher le message de succès après 5 secondes
        setTimeout(() => {
          this.showSuccess = false;
        }, 5000);
      }, 1000);
    }
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