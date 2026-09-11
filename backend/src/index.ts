import 'dotenv/config';
import { env } from './config/env';
import { closeDatabase, getDatabase } from './db/mongo';
import { defaultProfile } from './data/defaultProfile';
import type { ProfileDocument } from './types/profile';
import { createApp } from './app';

async function bootstrap() {
  const database = await getDatabase();
  const profiles = database.collection<ProfileDocument>('profiles');

  if (env.NODE_ENV !== 'production') {
    await profiles.updateOne(
      { _id: 'main' },
      {
        $setOnInsert: defaultProfile
      },
      {
        upsert: true
      }
    );
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`Backend listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    server.close();
    await closeDatabase();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
