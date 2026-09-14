import type { LocalizedTextValue } from '../types/profile';

export function getLocalizedText(value: LocalizedTextValue | null | undefined, locale: 'fi' | 'en' = 'en'): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value[locale] || value.en || value.fi || '';
}