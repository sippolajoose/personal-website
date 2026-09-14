import type { Locale } from '../i18n';
import type { LocalizedTextValue } from '../types';

export function getLocalizedText(value: LocalizedTextValue | null | undefined, locale: Locale): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value[locale] || value.en || value.fi || '';
}