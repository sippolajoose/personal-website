import 'dotenv/config';
import { closeDatabase, getDatabase } from '../db/mongo';
import { defaultProfile } from '../data/defaultProfile';
import type { ProfileDocument } from '../types/profile';

async function seed() {
  const database = await getDatabase();
  const profiles = database.collection<ProfileDocument>('profiles');

  await profiles.replaceOne({ _id: 'main' }, defaultProfile, { upsert: true });

  console.log('Seeded profile data');
  await closeDatabase();
}

seed().catch(async (error) => {
  console.error(error);
  await closeDatabase();
  process.exit(1);
});
