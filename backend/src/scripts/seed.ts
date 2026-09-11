import 'dotenv/config';
import { env } from '../config/env';
import { closeDatabase, getDatabase } from '../db/mongo';
import { defaultProfile } from '../data/defaultProfile';
import type { ProfileDocument } from '../types/profile';

const localMongoUri = /^mongodb:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/;
const confirmation = 'I_UNDERSTAND_THIS_REPLACES_LOCAL_PROFILE';

async function seed() {
  if (!localMongoUri.test(env.MONGODB_URI)) {
    throw new Error('Refusing to seed: MONGODB_URI must point to localhost or 127.0.0.1.');
  }

  if (env.SEED_CONFIRMATION !== confirmation) {
    throw new Error(`Refusing to seed: set SEED_CONFIRMATION=${confirmation} to continue.`);
  }

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
