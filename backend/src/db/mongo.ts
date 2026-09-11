import { MongoClient, type Db } from 'mongodb';
import { env } from '../config/env';

let mongoClient: MongoClient | undefined;

export async function getDatabase(): Promise<Db> {
  if (!mongoClient) {
    mongoClient = new MongoClient(env.MONGODB_URI);
    await mongoClient.connect();
  }

  return mongoClient.db(env.MONGODB_DB);
}

export async function closeDatabase(): Promise<void> {
  if (!mongoClient) {
    return;
  }

  await mongoClient.close();
  mongoClient = undefined;
}
