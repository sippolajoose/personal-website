import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getProfile } from '../services/api';
import { useProfileStore } from './profile';
import type { ProfileDocument } from '../types';

vi.mock('../services/api', () => ({
  getProfile: vi.fn()
}));

const mockGetProfile = vi.mocked(getProfile);

const profile: ProfileDocument = {
  _id: 'main',
  name: 'Example Profile',
  headline: 'Frontend developer',
  summary: { en: 'Builds useful web applications.' },
  location: 'Helsinki',
  email: 'person@example.com',
  links: [],
  socialLinks: [],
  skills: [],
  experience: [],
  education: [],
  certificates: [],
  projects: []
};

describe('profile store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockGetProfile.mockReset();
  });

  it('caches a loaded profile until a forced reload', async () => {
    const updatedProfile = { ...profile, name: 'Updated Profile' };
    mockGetProfile
      .mockResolvedValueOnce(profile)
      .mockResolvedValueOnce(updatedProfile);
    const store = useProfileStore();

    await expect(store.loadProfile()).resolves.toEqual(profile);
    await expect(store.loadProfile()).resolves.toEqual(profile);
    await expect(store.loadProfile(true)).resolves.toEqual(updatedProfile);

    expect(mockGetProfile).toHaveBeenCalledTimes(2);
  });

  it('shares an in-flight request between concurrent callers', async () => {
    let resolveProfile:
      | ((value: ProfileDocument | PromiseLike<ProfileDocument>) => void)
      | undefined;
    mockGetProfile.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveProfile = resolve;
        })
    );
    const store = useProfileStore();

    const firstRequest = store.loadProfile();
    const secondRequest = store.loadProfile();

    expect(mockGetProfile).toHaveBeenCalledOnce();
    expect(store.loading).toBe(true);

    if (!resolveProfile) {
      throw new Error('The profile request did not start');
    }

    resolveProfile(profile);

    await expect(Promise.all([firstRequest, secondRequest])).resolves.toEqual([
      profile,
      profile
    ]);
    expect(store.loading).toBe(false);
  });

  it('stores the error and clears loading when the request fails', async () => {
    mockGetProfile.mockRejectedValue(new Error('Service unavailable'));
    const store = useProfileStore();

    await expect(store.loadProfile()).resolves.toBeNull();

    expect(store.error).toBe('Service unavailable');
    expect(store.loading).toBe(false);
  });
});
