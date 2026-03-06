import {
  Component, OnInit, OnDestroy, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Question {
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  emoji: string;
}

interface LeaderScore {
  name: string;
  score: number;
  correct: number;
  total: number;
  duration: number;
  date: string;
}

const ALL_QUESTIONS: Question[] = [
  {
    question: "Qu'est-ce qu'un Ivoirien dit quand il veut dormir ?",
    choices: ["Somo", "Dumu", "Wari", "Go"],
    answer: 0,
    explanation: "\"Somo\" vient du Dioula et signifie dormir.",
    emoji: "😴"
  },
  {
    question: "Que dit un Ivoirien quand il a un chagrin d'amour ?",
    choices: ["C'est Zo", "Goumin", "Oueh j'ai mal ", "Faut croire"],
    answer: 1,
    explanation: "\"Goumin\" ça décrit bien la douleur du cœur brisé.",
    emoji: "💔"
  },
  {
    question: "Que dit un Ivoirien quand il est très énervé ?",
    choices: ["Mon cœur est chaud hein", "Je suis enervé", "Babière", "C'est dure"],
    answer: 0,
    explanation: "\"Mon cœur est chaud hein \" = je suis vraiment énervé !",
    emoji: "🔥"
  },
  {
    question: "Que dit un Ivoirien pour dire qu'il est beau / stylé ?",
    choices: ["Je suis jolie hein", "Tchié je sors hein", "Je vais somo", "mimi aussi"],
    answer: 1,
    explanation: "\"Tchié je sors hein\" = t'es trop beau / stylé !",
    emoji: "😎"
  },
  {
    question: "Comment dit-on \"argent\" en Dioula ?",
    choices: ["Somo", "Muso", "Wari", "Cé"],
    answer: 2,
    explanation: "\"Wari\" signifie argent en Dioula.",
    emoji: "💰"
  },
  {
    question: "Comment dit-on \"manger\" en Dioula ?",
    choices: ["Dumu", "Somo", "Go", "Wari"],
    answer: 0,
    explanation: "\"Dumu\" signifie manger en Dioula.",
    emoji: "🍛"
  },
  {
    question: "Que dit un Ivoirien pour dire \"partons\" ?",
    choices: ["bougeons tchai ", "on a bougé", "On n'a qu'a go", "On dumu"],
    answer: 2,
    explanation: "\"On a bougé\" = on y va, allons-y !",
    emoji: "🚀"
  },
  {
    question: "Comment dit-on \"femme\" en Dioula ?",
    choices: ["Cé", "Muso", "Gars", "So"],
    answer: 1,
    explanation: "\"Muso\" signifie femme en Dioula.",
    emoji: "👩"
  },
  {
    question: "Que dit un Ivoirien pour dire \"désolé\" ?",
    choices: ["au temps pour toi au temps pour moi  ", "on a bougé", "Ah oh ", "désolé hein"],
    answer: 2,
    explanation: "\"au temps pour toi au temps pour moi \" = désolé !",
    emoji: "🚀"
  },
  {
    question: "Que dit un Ivoirien pour dire que quelque chose est super bien ?",
    choices: ["C'est goumin", "C'est bien ", "C'est Zo ", "C'est bon "],
    answer: 2,
    explanation: "\"C'est Zo\" = c'est super / très bien !",
    emoji: "🤩"
  },
  {
    question: "Comment dit-on \"maison\" en Dioula ?",
    choices: ["Wari", "So", "Go", "Muso"],
    answer: 1,
    explanation: "\"So\" signifie maison en Dioula.",
    emoji: "🏠"
  },
  {
    question: "Que dit un Ivoirien pour exprimer une grande surprise ?",
    choices: ["TCHIEEEE !", "Hann !", "Faut croire !", "eh ouaye !"],
    answer: 0,
    explanation: "\"TCHIEEEE !\" est l'exclamation de surprise en nouchi.",
    emoji: "😱"
  },
  {
    question: "Comment dit-on \"homme\" en Dioula ?",
    choices: ["Muso", "So", "Cé", "Wari"],
    answer: 2,
    explanation: "\"Cé\" (ou Kè) signifie homme en Dioula.",
    emoji: "👨"
  },
  {
    question: "Que dit un Ivoirien quand quelqu'un est vraiment embêtant ?",
    choices: ["Tchai tu es problème mon fils ", "Tu me prends la tête hein", "tu fatigue petit", "C'est wari"],
    answer: 1,
    explanation: "\"Tchai tu es ennuie hein\" = tu es vraiment embêtant !",
    emoji: "😤"
  },
  {
    question: "Que dit un Ivoirien quand il fait très chaud ?",
    choices: ["Oueh chaleur la hein", "Soleil là a quoi", "Dumu là", "C'est djo"],
    answer: 1,
    explanation: "\"Soleil là a quoi\" = il fait vraiment très chaud !",
    emoji: "☀️"
  },
  {
    question: "Comment appelle-t-on un ami proche en nouchi ?",
    choices: ["Muso", "Frère sang / mon Gars sure", "Wari", "So"],
    answer: 1,
    explanation: "\"Frère sang\" ou \"mon Gars sure\" = mon ami, mon pote !",
    emoji: "🤝"
  },
  {
    question: "Que dit un Ivoirien pour dire qu'il n'a pas d'argent ?",
    choices: ["J'ai coulé", "Je suis zéro meme", "j'ai quoi ", "Je suis djo"],
    answer: 1,
    explanation: "\"j'ai coulé\" = je suis fauché, j'ai plus un sous !",
    emoji: "😭"
  },
  {
    question: "Que dit un Ivoirien quand quelqu'un fait quelque chose de vraiment bien ?",
    choices: ["Tu as tué hein Man", "Fort aussi petit ", "Eh fils", "Dumu là"],
    answer: 0,
    explanation: "\"Fort aussi petit\" = franchement t'assures !",
    emoji: "👏"
  },
  {
    question: "Comment dit-on \"eau\" en Dioula ?",
    choices: ["Jii", "Wari", "So", "Dumu"],
    answer: 0,
    explanation: "\"Jii\" signifie eau en Dioula.",
    emoji: "💧"
  },
];

const TIME_PER_Q = 15;
const LS_KEY = 'ivoirien-quiz-lb';
const MAX_Q = 10;

@Component({
  selector: 'app-quiz-ivoirien',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-ivoirien.component.html',
  styleUrls: ['./quiz-ivoirien.component.css'],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms cubic-bezier(.77,0,.18,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ]),
    trigger('pop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.85)' }),
        animate('400ms cubic-bezier(.34,1.56,.64,1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class QuizIvoirienComponent implements OnInit, OnDestroy {

  screen       = signal<'home' | 'quiz' | 'final' | 'leaderboard'>('home');
  playerName   = signal('');
  nameError    = signal('');
  currentIndex = signal(0);
  selected     = signal<number | null>(null);
  isCorrect    = signal<boolean | null>(null);
  timeLeft     = signal(TIME_PER_Q);
  score        = signal(0);
  correctCount = signal(0);
  showExplain  = signal(false);
  leaderboard  = signal<LeaderScore[]>([]);
  questions: Question[] = [];
  totalSecs = 0;

  private timer: any  = null;
  private startMs     = 0;

  currentQ   = computed(() => this.questions[this.currentIndex()] ?? null);
  timerPct   = computed(() => (this.timeLeft() / TIME_PER_Q) * 100);
  progressPct = computed(() => Math.round((this.currentIndex() / this.questions.length) * 100));

  ngOnInit()    { this.loadLB(); }
  ngOnDestroy() { this.stopTimer(); }

  // ─── Input ───────────────────────────────────────────────────
  onNameInput(val: string) {
    this.playerName.set(val.slice(0, 20));
    this.nameError.set('');
  }

  // ─── Start quiz ──────────────────────────────────────────────
  startQuiz() {
    const name = this.playerName().trim();
    if (!name) { this.nameError.set('Entre ton prénom pour jouer ! 😄'); return; }

    this.questions = [...ALL_QUESTIONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, MAX_Q);

    this.currentIndex.set(0);
    this.score.set(0);
    this.correctCount.set(0);
    this.startMs = Date.now();
    this.screen.set('quiz');
    this.beginQuestion();
  }

  // ─── Question flow ───────────────────────────────────────────
  private beginQuestion() {
    this.selected.set(null);
    this.isCorrect.set(null);
    this.showExplain.set(false);
    this.timeLeft.set(TIME_PER_Q);
    this.startTimer();
  }

  choose(i: number) {
    if (this.selected() !== null) return;
    this.stopTimer();
    this.selected.set(i);
    const correct = i === this.currentQ()!.answer;
    this.isCorrect.set(correct);
    if (correct) {
      const pts = Math.max(100, Math.round((this.timeLeft() / TIME_PER_Q) * 1000));
      this.score.update(s => s + pts);
      this.correctCount.update(c => c + 1);
    }
    this.showExplain.set(true);
    setTimeout(() => this.advance(), 2400);
  }

  private advance() {
    const next = this.currentIndex() + 1;
    if (next < this.questions.length) {
      this.currentIndex.set(next);
      this.beginQuestion();
    } else {
      this.totalSecs = Math.round((Date.now() - this.startMs) / 1000);
      this.saveScore();
      this.screen.set('final');
    }
  }

  private startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      const t = this.timeLeft() - 1;
      this.timeLeft.set(t);
      if (t <= 0) {
        this.stopTimer();
        if (this.selected() === null) this.choose(-1);
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  // ─── Helpers ─────────────────────────────────────────────────
  getChoiceClass(i: number): string {
    const sel = this.selected();
    if (sel === null) return '';
    const ans = this.currentQ()!.answer;
    if (i === ans) return 'correct';
    if (i === sel) return 'wrong';
    return 'dimmed';
  }

  get timerColor(): string {
    const t = this.timeLeft();
    if (t > 8) return 'var(--accent)';
    if (t > 4) return '#F59E0B';
    return '#EF4444';
  }

  get rank(): string {
    const pct = this.correctCount() / this.questions.length;
    if (pct === 1)   return 'Légende Ivoirienne 👑';
    if (pct >= 0.8)  return 'Expert Nouchi 🥇';
    if (pct >= 0.6)  return 'Bon élève 👍';
    if (pct >= 0.4)  return 'Apprenti Abidjanais 🤔';
    return 'Faut réviser l\'Ivoirien 😅';
  }

  // ─── Leaderboard ─────────────────────────────────────────────
  private saveScore() {
    const entry: LeaderScore = {
      name:     this.playerName().trim(),
      score:    this.score(),
      correct:  this.correctCount(),
      total:    this.questions.length,
      duration: this.totalSecs,
      date:     new Date().toLocaleDateString('fr-FR')
    };
    const existing = this.leaderboard();
    const idx = existing.findIndex(
      e => e.name.toLowerCase() === entry.name.toLowerCase()
    );
    let updated: LeaderScore[];
    if (idx >= 0) {
      // Keep only the best score per player
      updated = [...existing];
      if (entry.score > existing[idx].score) updated[idx] = entry;
    } else {
      updated = [...existing, entry];
    }
    updated = updated.sort((a, b) => b.score - a.score || a.duration - b.duration);
    this.leaderboard.set(updated);
    try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch {}
  }

  private loadLB() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) this.leaderboard.set(JSON.parse(raw));
    } catch {}
  }

  getRankBadge(i: number): string {
    return ['🥇','🥈','🥉'][i] ?? `#${i + 1}`;
  }

  formatDur(s: number): string {
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}min${s % 60}s` : `${s}s`;
  }

  resetLB() {
    this.leaderboard.set([]);
    try { localStorage.removeItem(LS_KEY); } catch {}
  }
}
