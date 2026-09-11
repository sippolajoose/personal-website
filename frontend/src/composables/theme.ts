import { computed, ref } from 'vue';

export type ThemeMode = 'light' | 'dark';

const storageKey = 'personal-website-theme';
const themeMode = ref<ThemeMode>('light');

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
  themeMode.value = mode;

  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, mode);
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: mode } }));
}

export function initializeTheme() {
  if (typeof window === 'undefined') {
    return;
  }

  const storedTheme = window.localStorage.getItem(storageKey);
  const initialTheme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : getSystemTheme();

  applyTheme(initialTheme);
}

export function useTheme() {
  const isDarkMode = computed(() => themeMode.value === 'dark');

  const toggleTheme = () => {
    applyTheme(themeMode.value === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (mode: ThemeMode) => {
    applyTheme(mode);
  };

  return {
    isDarkMode,
    setTheme,
    themeMode,
    toggleTheme,
  };
}
