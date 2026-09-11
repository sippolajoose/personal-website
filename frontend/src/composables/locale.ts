import { ref } from 'vue';

export type Locale = 'fi' | 'en';

const storedLocale = window.localStorage.getItem('locale');
const locale = ref<Locale>(storedLocale === 'fi' ? 'fi' : 'en');

export function useLocale() {
  function setLocale(nextLocale: Locale) {
    locale.value = nextLocale;
    window.localStorage.setItem('locale', nextLocale);
    document.documentElement.lang = nextLocale;
    window.dispatchEvent(new CustomEvent('localechange'));
  }

  function toggleLocale() {
    setLocale(locale.value === 'en' ? 'fi' : 'en');
  }

  return { locale, setLocale, toggleLocale };
}
