import 'dotenv/config';
import { env } from './config/env';
import { createApp } from './app';
import { closeDatabase } from './db/mongo';

async function bootstrap() {
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
