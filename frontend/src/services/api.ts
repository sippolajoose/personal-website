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

export interface FeedbackSubmission {
  message: string;
  displayName?: string;
  locale: Locale;
  publishConsent: boolean;
}

export interface FeedbackItem {
  message: string;
  displayName?: string;
  locale: Locale;
  featured: boolean;
  createdAt: string;
}

export async function getPublishedFeedback(): Promise<FeedbackItem[]> {
  const result = await readJson<{ feedback: FeedbackItem[] }>('/feedback');
  return result.feedback;
}

export async function sendFeedback(feedback: FeedbackSubmission): Promise<void> {
  const response = await fetch(`${baseUrl}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}
