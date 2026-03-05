import { Component, signal, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('portfolio-didi');

  private cursor!: HTMLElement;
  private ring!: HTMLElement;
  private curtain!: HTMLElement;
  private ringX = 0;
  private ringY = 0;
  private mouseX = 0;
  private mouseY = 0;
  private rafId = 0;
  private routerSub!: Subscription;
  private isFirstNav = true;
  private curtainOpen = false;
  private hideTimer = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.cursor  = document.getElementById('cursor')!;
    this.ring    = document.getElementById('cursor-ring')!;
    this.curtain = document.getElementById('page-curtain')!;

    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseenter', this.onEnterEl, true);
    document.addEventListener('mouseleave', this.onLeaveEl, true);

    this.animateRing();
    this.setupTransitions();
  }

  /* ── Cursor ── */
  private onMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    if (this.cursor) {
      this.cursor.style.left = e.clientX + 'px';
      this.cursor.style.top  = e.clientY + 'px';
    }
  };

  private onEnterEl = (e: Event) => {
    const t = e.target as Element;
    if (t.closest('a, button, [data-hover]')) document.body.classList.add('cursor-hover');
  };
  private onLeaveEl = (e: Event) => {
    const t = e.target as Element;
    if (t.closest('a, button, [data-hover]')) document.body.classList.remove('cursor-hover');
  };

  private animateRing() {
    this.ringX += (this.mouseX - this.ringX) * 0.12;
    this.ringY += (this.mouseY - this.ringY) * 0.12;
    if (this.ring) {
      this.ring.style.left = this.ringX + 'px';
      this.ring.style.top  = this.ringY + 'px';
    }
    this.rafId = requestAnimationFrame(() => this.animateRing());
  }

  /* ── Page transitions ── */
  private setupTransitions() {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.isFirstNav) { this.isFirstNav = false; return; }
        this.openCurtain();
      }
      if (event instanceof NavigationEnd && this.curtainOpen) {
        clearTimeout(this.hideTimer);
        this.hideTimer = window.setTimeout(() => this.closeCurtain(), 80);
      }
    });
  }

  private openCurtain() {
    this.curtainOpen = true;
    const c = this.curtain;
    // Reset without transition
    c.style.transition = 'none';
    c.style.transform  = 'translateY(-100%)';
    // Force reflow then animate
    requestAnimationFrame(() => requestAnimationFrame(() => {
      c.style.transition = 'transform 0.44s cubic-bezier(0.87, 0, 0.13, 1)';
      c.style.transform  = 'translateY(0)';
    }));
  }

  private closeCurtain() {
    const c = this.curtain;
    c.style.transition = 'transform 0.52s cubic-bezier(0.16, 1, 0.3, 1)';
    c.style.transform  = 'translateY(100%)';
    // Reset off-screen after exit so it's ready for next time
    window.setTimeout(() => {
      c.style.transition = 'none';
      c.style.transform  = 'translateY(-100%)';
      this.curtainOpen   = false;
    }, 540);
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) return;
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mouseenter', this.onEnterEl, true);
    document.removeEventListener('mouseleave', this.onLeaveEl, true);
    cancelAnimationFrame(this.rafId);
    clearTimeout(this.hideTimer);
    this.routerSub?.unsubscribe();
  }
}
