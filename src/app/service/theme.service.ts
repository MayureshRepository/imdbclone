import { Injectable } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';
const THEME_COLORS: Record<Theme, string> = {
  dark: '#07080c',
  light: '#f8f9fb',
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
    this.setTheme(this.isDark ? 'light' : 'dark');
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
