import { getProfileDocument } from '../repositories/profileRepository';

export async function getProfile() {
  return getProfileDocument();
}
