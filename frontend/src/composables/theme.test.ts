import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeTheme, useTheme } from './theme';

const storageKey = 'personal-website-theme';

function setSystemTheme(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockReturnValue({ matches })
  });
}

describe('theme composable', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
  });

  it('restores a saved theme and applies it to the document', () => {
    window.localStorage.setItem(storageKey, 'dark');

    initializeTheme();

    expect(useTheme().isDarkMode.value).toBe(true);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('uses the system preference when no theme is saved', () => {
    setSystemTheme(true);

    initializeTheme();

    expect(useTheme().themeMode.value).toBe('dark');
    expect(window.localStorage.getItem(storageKey)).toBe('dark');
  });

  it('toggles and persists the theme', () => {
    window.localStorage.setItem(storageKey, 'light');
    initializeTheme();

    const { isDarkMode, toggleTheme } = useTheme();
    toggleTheme();

    expect(isDarkMode.value).toBe(true);
    expect(window.localStorage.getItem(storageKey)).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
