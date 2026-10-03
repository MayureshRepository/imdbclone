import { Injectable } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';
const THEME_COLORS: Record<Theme, string> = {
  dark: '#090b16',
  light: '#f4f5fb',
};

/**
 * Dark mode is the default. Light mode is enabled by adding the `light`
 * class to <html>; the color tokens in styles.css switch on that class.
 * index.html applies the saved theme before Angular boots to avoid a flash.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme: Theme = this.loadTheme();

  constructor() {
    this.apply(this.theme);
  }

  get isDark(): boolean {
    return this.theme === 'dark';
  }

  toggle() {
    const next: Theme = this.isDark ? 'light' : 'dark';
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || reduceMotion) {
      this.setTheme(next);
      return;
    }

    // Cross-fade the whole page between themes instead of snapping colors.
    const root = document.documentElement;
    root.classList.add('theme-switching');
    doc
      .startViewTransition(() => this.setTheme(next))
      .finished.finally(() => root.classList.remove('theme-switching'));
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage unavailable (e.g. private mode); theme still applies for this session.
    }
    this.apply(theme);
  }

  private loadTheme(): Theme {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }

  private apply(theme: Theme) {
    document.documentElement.classList.toggle('light', theme === 'light');
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[theme]);
  }
}
