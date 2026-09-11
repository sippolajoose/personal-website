import { getDatabase } from '../db/mongo';
import type { ProfileDocument } from '../types/profile';

const collectionName = 'profiles';

export async function getProfileDocument(): Promise<ProfileDocument> {
  const database = await getDatabase();
  const profile = await database.collection<ProfileDocument>(collectionName).findOne({ _id: 'main' });

  if (!profile) {
    throw new Error('Profile data is missing. Run the seed script first.');
  }

  return profile;
}
