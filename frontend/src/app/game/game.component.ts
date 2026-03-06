import {
  Component, ElementRef, ViewChild, AfterViewInit,
  OnDestroy, HostListener, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

const GRID = 20;
const CELL = 20;
const LS_SNAKE = 'snake-leaderboard';

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point { x: number; y: number; }

interface SnakeScore {
  name: string;
  score: number;
  level: number;
  date: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms cubic-bezier(.77,0,.18,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class GameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  score           = signal(0);
  bestScore       = signal(0);
  lives           = signal(3);
  level           = signal(1);
  state           = signal<'idle' | 'running' | 'paused' | 'over'>('idle');
  playerName      = signal('');
  nameError       = signal('');
  leaderboard     = signal<SnakeScore[]>([]);
  showLeaderboard = signal(false);

  isPaused  = computed(() => this.state() === 'paused');
  isOver    = computed(() => this.state() === 'over');
  isIdle    = computed(() => this.state() === 'idle');
  isRunning = computed(() => this.state() === 'running');

  private snake: Point[] = [];
  private food: Point    = { x: 10, y: 10 };
  private bonus: Point | null = null;
  private dir: Dir       = 'RIGHT';
  private nextDir: Dir   = 'RIGHT';
  private loop: any      = null;
  private bonusTimer: any = null;
  private ctx!: CanvasRenderingContext2D;
  private frameCount = 0;
  private bonusActive = false;

  private get speed(): number {
    const l = this.level();
    return Math.max(60, 200 - (l - 1) * 25);
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width  = GRID * CELL;
    canvas.height = GRID * CELL;
    this.ctx = canvas.getContext('2d')!;
    this.drawIdle();
    this.loadLB();
  }

  ngOnDestroy() { this.stopLoop(); }

  // ─── Controls ───────────────────────────────────────────────
  onNameInput(val: string) {
    this.playerName.set(val.slice(0, 20));
    this.nameError.set('');
  }

  startGame() {
    if (!this.playerName().trim()) {
      this.nameError.set('Entre ton prénom pour jouer ! 😄');
      return;
    }
    this.score.set(0);
    this.lives.set(3);
    this.level.set(1);
    this.frameCount = 0;
    this.showLeaderboard.set(false);
    this.initSnake();
    this.placeFood();
    this.state.set('running');
    this.startLoop();
  }

  togglePause() {
    if (this.state() === 'running') {
      this.state.set('paused');
      this.stopLoop();
    } else if (this.state() === 'paused') {
      this.state.set('running');
      this.startLoop();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
      e.preventDefault();
    }
    const map: Record<string, Dir> = {
      ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
      w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT'
    };
    if (map[e.key]) {
      const opp: Record<Dir, Dir> = { UP:'DOWN', DOWN:'UP', LEFT:'RIGHT', RIGHT:'LEFT' };
      if (map[e.key] !== opp[this.dir]) this.nextDir = map[e.key];
    }
    if (e.key === ' ') {
      if (this.state() === 'over') this.startGame();
      else if (this.state() === 'idle' && this.playerName().trim()) this.startGame();
      else if (this.state() === 'running' || this.state() === 'paused') this.togglePause();
    }
  }

  onSwipe(dir: Dir) {
    const opp: Record<Dir, Dir> = { UP:'DOWN', DOWN:'UP', LEFT:'RIGHT', RIGHT:'LEFT' };
    if (dir !== opp[this.dir]) { this.nextDir = dir; }
  }

  private touchStartX = 0;
  private touchStartY = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    const dy = e.changedTouches[0].clientY - this.touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      this.onSwipe(dy > 0 ? 'DOWN' : 'UP');
    }
  }

  // ─── Game logic ─────────────────────────────────────────────
  private initSnake() {
    const cx = Math.floor(GRID / 2);
    const cy = Math.floor(GRID / 2);
    this.snake = [
      { x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }
    ];
    this.dir     = 'RIGHT';
    this.nextDir = 'RIGHT';
    this.bonusActive = false;
    this.bonus = null;
    clearTimeout(this.bonusTimer);
  }

  private startLoop() {
    this.stopLoop();
    this.loop = setInterval(() => this.tick(), this.speed);
  }

  private stopLoop() {
    if (this.loop) { clearInterval(this.loop); this.loop = null; }
  }

  private tick() {
    this.dir = this.nextDir;
    const head = this.snake[0];
    const moves: Record<Dir, Point> = {
      UP:    { x: head.x,     y: head.y - 1 },
      DOWN:  { x: head.x,     y: head.y + 1 },
      LEFT:  { x: head.x - 1, y: head.y     },
      RIGHT: { x: head.x + 1, y: head.y     }
    };
    const next = moves[this.dir];

    // Wall collision
    if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) {
      this.handleDeath(); return;
    }
    // Self collision
    if (this.snake.some(s => s.x === next.x && s.y === next.y)) {
      this.handleDeath(); return;
    }

    this.snake.unshift(next);

    // Food eaten
    if (next.x === this.food.x && next.y === this.food.y) {
      const pts = 10 * this.level();
      this.score.update(s => s + pts);
      this.updateBest();
      this.placeFood();
      this.frameCount++;

      // Level up every 5 foods
      if (this.frameCount % 5 === 0) {
        this.level.update(l => l + 1);
        this.stopLoop(); this.startLoop();
      }
      // Spawn bonus every 10 foods
      if (this.frameCount % 10 === 0) this.spawnBonus();
    } else if (this.bonusActive && this.bonus && next.x === this.bonus.x && next.y === this.bonus.y) {
      this.score.update(s => s + 50 * this.level());
      this.updateBest();
      this.bonusActive = false;
      this.bonus = null;
      clearTimeout(this.bonusTimer);
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  private handleDeath() {
    this.lives.update(l => l - 1);
    if (this.lives() <= 0) {
      this.stopLoop();
      this.updateBest();
      this.saveToLB();
      this.state.set('over');
      this.drawGameOver();
    } else {
      this.stopLoop();
      this.initSnake();
      this.placeFood();
      this.startLoop();
    }
  }

  private placeFood() {
    let pos: Point;
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (this.snake.some(s => s.x === pos.x && s.y === pos.y));
    this.food = pos;
  }

  private spawnBonus() {
    let pos: Point;
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (
      this.snake.some(s => s.x === pos.x && s.y === pos.y) ||
      (pos.x === this.food.x && pos.y === this.food.y)
    );
    this.bonus = pos;
    this.bonusActive = true;
    clearTimeout(this.bonusTimer);
    this.bonusTimer = setTimeout(() => {
      this.bonusActive = false;
      this.bonus = null;
    }, 5000);
  }

  private updateBest() {
    const s = this.score();
    if (s > this.bestScore()) this.bestScore.set(s);
  }

  private saveToLB() {
    const entry: SnakeScore = {
      name:  this.playerName().trim(),
      score: this.score(),
      level: this.level(),
      date:  new Date().toLocaleDateString('fr-FR')
    };
    const existing = this.leaderboard();
    const idx = existing.findIndex(
      e => e.name.toLowerCase() === entry.name.toLowerCase()
    );
    let updated: SnakeScore[];
    if (idx >= 0) {
      // Keep only best score per player
      updated = [...existing];
      if (entry.score > existing[idx].score) updated[idx] = entry;
    } else {
      updated = [...existing, entry];
    }
    updated = updated.sort((a, b) => b.score - a.score);
    this.leaderboard.set(updated);
    try { localStorage.setItem(LS_SNAKE, JSON.stringify(updated)); } catch {}
  }

  private loadLB() {
    try {
      const raw = localStorage.getItem(LS_SNAKE);
      if (raw) {
        const lb: SnakeScore[] = JSON.parse(raw);
        this.leaderboard.set(lb);
        const best = lb.reduce((m, e) => Math.max(m, e.score), 0);
        this.bestScore.set(best);
      }
    } catch {}
  }

  getRankBadge(i: number): string {
    return ['🥇','🥈','🥉'][i] ?? `#${i + 1}`;
  }

  resetLB() {
    this.leaderboard.set([]);
    this.bestScore.set(0);
    try { localStorage.removeItem(LS_SNAKE); } catch {}
  }

  // ─── Drawing ─────────────────────────────────────────────────
  private draw() {
    const ctx = this.ctx;
    const W = GRID * CELL;

    // Background grid
    ctx.fillStyle = '#040d1a';
    ctx.fillRect(0, 0, W, W);

    ctx.strokeStyle = 'rgba(59,130,246,0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, W); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
    }

    // Food
    this.drawFood(this.food.x, this.food.y, '#FF6B6B', '🍎');

    // Bonus
    if (this.bonusActive && this.bonus) {
      this.drawFood(this.bonus.x, this.bonus.y, '#FFD700', '⭐');
    }

    // Snake
    this.snake.forEach((seg, i) => {
      const ratio = 1 - i / this.snake.length;
      const r = Math.round(59  + ratio * 10);
      const g = Math.round(130 + ratio * 20);
      const b = Math.round(246);
      ctx.fillStyle = `rgb(${r},${g},${b})`;

      const pad = i === 0 ? 1 : 2;
      const size = CELL - pad * 2;
      const rx = 4;
      this.roundRect(ctx, seg.x * CELL + pad, seg.y * CELL + pad, size, size, rx);

      // Eyes on head
      if (i === 0) {
        ctx.fillStyle = '#040d1a';
        const ex = seg.x * CELL + CELL / 2;
        const ey = seg.y * CELL + CELL / 2;
        const offsets: Record<Dir, [number,number,number,number]> = {
          RIGHT: [4, -3, 4, 3], LEFT: [-4,-3,-4,3],
          UP:    [-3,-4, 3,-4], DOWN: [-3, 4, 3, 4]
        };
        const [ox1,oy1,ox2,oy2] = offsets[this.dir];
        ctx.beginPath(); ctx.arc(ex+ox1, ey+oy1, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex+ox2, ey+oy2, 2, 0, Math.PI*2); ctx.fill();
      }
    });
  }

  private drawFood(x: number, y: number, color: string, emoji: string) {
    const ctx = this.ctx;
    const cx = x * CELL + CELL / 2;
    const cy = y * CELL + CELL / 2;

    // Glow
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, CELL);
    grad.addColorStop(0, color + '88');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, CELL, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `${CELL - 4}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, cx, cy);
  }

  private drawIdle() {
    const ctx = this.ctx;
    const W = GRID * CELL;
    ctx.fillStyle = '#040d1a';
    ctx.fillRect(0, 0, W, W);

    ctx.strokeStyle = 'rgba(59,130,246,0.07)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, W); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
    }

    ctx.fillStyle = 'rgba(59,130,246,0.15)';
    ctx.beginPath();
    ctx.arc(W/2, W/2, 60, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#3B82F6';
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Press SPACE', W/2, W/2 - 12);
    ctx.fillText('to start', W/2, W/2 + 14);
  }

  private drawGameOver() {
    this.draw();
    const ctx = this.ctx;
    const W = GRID * CELL;
    ctx.fillStyle = 'rgba(4,13,26,0.82)';
    ctx.fillRect(0, 0, W, W);

    ctx.fillStyle = '#FF6B6B';
    ctx.font = 'bold 28px "Fraunces", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', W/2, W/2 - 24);

    ctx.fillStyle = '#e8f0ff';
    ctx.font = '16px "Space Grotesk", sans-serif';
    ctx.fillText(`Score : ${this.score()}`, W/2, W/2 + 14);

    ctx.fillStyle = '#3B82F6';
    ctx.font = '13px "Space Grotesk", sans-serif';
    ctx.fillText('SPACE pour rejouer', W/2, W/2 + 42);
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }
}
