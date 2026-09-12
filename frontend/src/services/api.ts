import type { ProfileDocument } from '../types';
import type { Locale } from '../i18n';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getProfile(): Promise<ProfileDocument> {
  return readJson<ProfileDocument>('/profile');
}

export async function downloadResumePdf(locale: Locale): Promise<void> {
  const response = await fetch(`${baseUrl}/resume/pdf?locale=${locale}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = 'cv.pdf';
  anchor.click();

  URL.revokeObjectURL(objectUrl);
}
