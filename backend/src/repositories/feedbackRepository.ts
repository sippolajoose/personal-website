import { getDatabase } from '../db/mongo';
import type { FeedbackDocument } from '../types/feedback';

const collectionName = 'feedback';

export async function createFeedbackDocument(document: FeedbackDocument): Promise<void> {
  const database = await getDatabase();
  await database.collection<FeedbackDocument>(collectionName).insertOne(document);
}