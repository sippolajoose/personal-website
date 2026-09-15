import type { ProfileDocument } from '../types';

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
