// Safe LocalStorage helpers with try/catch fallback

const THEME_KEY = 'cn.theme';
const FONT_KEY = 'cn.fontStep';
const PROGRESS_KEY = 'cn.progress';
const BOOKMARKS_KEY = 'cn.bookmarks';
const LAST_READ_KEY = 'cn.lastRead';
const QUIZ_KEY = 'cn.quizScores';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface LastReadInfo {
  slug: string;
  title: string;
  timestamp: number;
}

export interface QuizTopicScore {
  bestScore: number;
  totalQuestions: number;
  lastAttemptDate: string;
}

export const storage = {
  getTheme(): ThemeMode {
    try {
      const val = localStorage.getItem(THEME_KEY);
      if (val === 'light' || val === 'dark' || val === 'system') return val;
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    return 'system';
  },

  setTheme(theme: ThemeMode) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  },

  getFontStep(): number {
    try {
      const val = localStorage.getItem(FONT_KEY);
      if (val !== null) {
        const step = parseInt(val, 10);
        if (!isNaN(step) && step >= 0 && step <= 3) return step;
      }
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    return 1; // Default step (0: -1, 1: normal, 2: +1, 3: +2)
  },

  setFontStep(step: number) {
    try {
      localStorage.setItem(FONT_KEY, step.toString());
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  },

  getProgress(): string[] {
    try {
      const val = localStorage.getItem(PROGRESS_KEY);
      if (val) return JSON.parse(val);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    return [];
  },

  toggleProgress(slug: string): boolean {
    const list = storage.getProgress();
    const index = list.indexOf(slug);
    let isRevised = false;
    if (index >= 0) {
      list.splice(index, 1);
      isRevised = false;
    } else {
      list.push(slug);
      isRevised = true;
    }
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    return isRevised;
  },

  isRevised(slug: string): boolean {
    return storage.getProgress().includes(slug);
  },

  getBookmarks(): string[] {
    try {
      const val = localStorage.getItem(BOOKMARKS_KEY);
      if (val) return JSON.parse(val);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    return [];
  },

  toggleBookmark(slug: string): boolean {
    const list = storage.getBookmarks();
    const index = list.indexOf(slug);
    let isBookmarked = false;
    if (index >= 0) {
      list.splice(index, 1);
      isBookmarked = false;
    } else {
      list.push(slug);
      isBookmarked = true;
    }
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    return isBookmarked;
  },

  isBookmarked(slug: string): boolean {
    return storage.getBookmarks().includes(slug);
  },

  getLastRead(): LastReadInfo | null {
    try {
      const val = localStorage.getItem(LAST_READ_KEY);
      if (val) return JSON.parse(val);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    return null;
  },

  setLastRead(info: { slug: string; title: string }) {
    try {
      const data: LastReadInfo = {
        ...info,
        timestamp: Date.now(),
      };
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  },

  getQuizScores(): Record<string, QuizTopicScore> {
    try {
      const val = localStorage.getItem(QUIZ_KEY);
      if (val) return JSON.parse(val);
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    return {};
  },

  saveQuizScore(topic: string, score: number, total: number) {
    try {
      const all = storage.getQuizScores();
      const prev = all[topic];
      const best = prev ? Math.max(prev.bestScore, score) : score;
      all[topic] = {
        bestScore: best,
        totalQuestions: total,
        lastAttemptDate: new Date().toISOString(),
      };
      localStorage.setItem(QUIZ_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  },
};
