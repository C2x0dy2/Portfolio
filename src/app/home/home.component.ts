import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('heroAnim', [
      transition(':enter', [
        query('.hero-content > *', [
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
    ])
  ]
})
export class HomeComponent {
  loading = signal(true);
  
  // Typing animation - changé pour correspondre au design
  subtitle = "I'M A DESIGNER";
  typedSubtitle = signal('');
  typingDone = signal(false);

  musicPlaying = signal(false);
  audio?: HTMLAudioElement;
  prefersReducedMotion = false;
  showSpotify = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.initMusic();
    }
    setTimeout(() => {
      this.loading.set(false);
      this.startTyping();
    }, 1600);
  }

  initMusic() {
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      this.audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      this.audio.loop = true;
      this.audio.volume = 0.3;
    }
  }

  startTyping() {
    if (this.prefersReducedMotion) {
      this.typedSubtitle.set(this.subtitle);
      this.typingDone.set(true);
      return;
    }
    let i = 0;
    const type = () => {
      if (i <= this.subtitle.length) {
        this.typedSubtitle.set(this.subtitle.slice(0, i));
        i++;
        setTimeout(type, 45);
      } else {
        this.typingDone.set(true);
      }
    };
    type();
  }

  toggleMusic() {
    if (!this.audio) {
      this.initMusic();
    }
    if (this.musicPlaying()) {
      this.audio?.pause();
      this.musicPlaying.set(false);
    } else {
      this.audio?.play().then(() => {
        this.musicPlaying.set(true);
      }).catch(error => {
        console.error('Erreur lecture audio:', error);
        alert('Impossible de jouer la musique. Vérifiez le fichier ou les permissions du navigateur.');
      });
    }
  }

  toggleSpotifyPlayer() {
    this.showSpotify = !this.showSpotify;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // Optionnel : tu peux afficher un fallback ici si tu veux
  }
}