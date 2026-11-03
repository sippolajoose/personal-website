import { describe, expect, it } from 'vitest';
import { getLocalizedText } from './localizedText';

describe('getLocalizedText', () => {
  it('returns a plain string unchanged', () => {
    expect(getLocalizedText('Hello', 'en')).toBe('Hello');
  });

  it('prefers the requested locale', () => {
    expect(getLocalizedText({ fi: 'Hei', en: 'Hello' }, 'fi')).toBe('Hei');
  });

  it('falls back to English when the requested locale is missing', () => {
    expect(getLocalizedText({ en: 'Hello' }, 'fi')).toBe('Hello');
  });

  it('falls back to Finnish when English is missing', () => {
    expect(getLocalizedText({ fi: 'Hei' }, 'en')).toBe('Hei');
  });

  it('returns an empty string for missing content', () => {
    expect(getLocalizedText(undefined, 'en')).toBe('');
    expect(getLocalizedText(null, 'fi')).toBe('');
  });
});
