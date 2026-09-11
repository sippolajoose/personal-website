import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProfile } from '../services/api';
import type { ProfileDocument } from '../types';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<ProfileDocument | null>(null);
  const loading = ref(false);
  const error = ref('');
  let pendingRequest: Promise<ProfileDocument | null> | null = null;

  async function loadProfile(force = false): Promise<ProfileDocument | null> {
    if (profile.value && !force) {
      return profile.value;
    }

    if (pendingRequest) {
      return pendingRequest;
    }

    loading.value = true;
    error.value = '';
    pendingRequest = getProfile()
      .then((loadedProfile) => {
        profile.value = loadedProfile;
        return loadedProfile;
      })
      .catch((caughtError: unknown) => {
        error.value = caughtError instanceof Error ? caughtError.message : 'Failed to load profile';
        return null;
      })
      .finally(() => {
        loading.value = false;
        pendingRequest = null;
      });

    return pendingRequest;
  }

  function clearProfile() {
    profile.value = null;
    error.value = '';
  }

  return { profile, loading, error, loadProfile, clearProfile };
});
