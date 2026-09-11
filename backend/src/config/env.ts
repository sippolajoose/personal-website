import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.string().default('development'),
  MONGODB_URI: z.string().min(1).default('mongodb://localhost:27017'),
  MONGODB_DB: z.string().min(1).default('personal_website'),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:5173')
});

export const env = envSchema.parse(process.env);
