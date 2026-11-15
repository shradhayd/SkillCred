import { Injectable, signal, computed, inject, effect, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private renderer = inject(RendererFactory2).createRenderer(null, null);
  private transitionTimer: ReturnType<typeof setTimeout> | null = null;
  private hasAppliedTheme = false;

  private readonly STORAGE_KEY = 'skillcred-theme';

  // Use Angular signals for reactive theme state
  private _theme = signal<Theme>(this.getInitialTheme());
  readonly theme = this._theme.asReadonly();

  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    // Apply theme on init and whenever it changes
    effect(() => {
      const currentTheme = this._theme();
      this.applyTheme(currentTheme);
    });
  }

  /** Determine the initial theme from localStorage or system preference */
  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /** Toggle between light and dark theme */
  toggleTheme(): void {
    this._theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  /** Set a specific theme */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  /** Apply the theme to the document and persist it */
  private applyTheme(theme: Theme): void {
    const html = this.document.documentElement;
    if (this.hasAppliedTheme) {
      if (this.transitionTimer !== null) {
        clearTimeout(this.transitionTimer);
      }

      this.renderer.addClass(html, 'theme-transitioning');
      // Apply the transition rule before changing the theme variables.
      void html.offsetWidth;
    }

    if (theme === 'dark') {
      this.renderer.addClass(html, 'dark-theme');
      this.renderer.removeClass(html, 'light-theme');
    } else {
      this.renderer.addClass(html, 'light-theme');
      this.renderer.removeClass(html, 'dark-theme');
    }

    if (this.hasAppliedTheme) {
      this.transitionTimer = setTimeout(() => {
        this.renderer.removeClass(html, 'theme-transitioning');
        this.transitionTimer = null;
      }, 350);
    }

    this.hasAppliedTheme = true;
    localStorage.setItem(this.STORAGE_KEY, theme);
  }
}