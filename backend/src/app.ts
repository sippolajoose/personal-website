import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';
import { openApiRouter } from './routes/openapi';
import { profileRouter } from './routes/profile';

const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: allowedOrigins
    })
  );
  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api', openApiRouter);
  app.use('/api', profileRouter);

  app.use(errorHandler);

  return app;
}
