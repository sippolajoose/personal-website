import { createI18n } from 'vue-i18n';
import en from './en';
import fi from './fi';

export type Locale = 'fi' | 'en';

const storageKey = 'locale';
const storedLocale = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
const initialLocale: Locale = storedLocale === 'fi' ? 'fi' : 'en';

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: { en, fi }
});

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, locale);
    document.documentElement.lang = locale;
  }
}

export function toggleLocale() {
  setLocale(i18n.global.locale.value === 'en' ? 'fi' : 'en');
}
