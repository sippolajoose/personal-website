import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';
import { profileRouter } from './routes/profile';
import { resumeRouter } from './routes/resume';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN
    })
  );
  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api', profileRouter);
  app.use('/api', resumeRouter);

  app.use(errorHandler);

  return app;
}
