import type { LocalizedTextValue } from '../types/profile';

export function getLocalizedText(value: LocalizedTextValue, locale: 'fi' | 'en' = 'en'): string {
  if (typeof value === 'string') {
    return value;
  }

  return value[locale] || value.en || value.fi;
}