import { getDatabase } from '../db/mongo';
import type { FeedbackDocument, PublishedFeedback } from '../types/feedback';

const collectionName = 'feedback';

export async function createFeedbackDocument(document: FeedbackDocument): Promise<void> {
  const database = await getDatabase();
  await database.collection<FeedbackDocument>(collectionName).insertOne(document);
}

export async function getPublishedFeedbackDocuments(): Promise<PublishedFeedback[]> {
  const database = await getDatabase();

  return database
    .collection<FeedbackDocument>(collectionName)
    .find(
      { status: 'approved', publishConsent: true },
      { projection: { _id: 0, message: 1, displayName: 1, locale: 1, featured: 1, createdAt: 1 } }
    )
    .sort({ featured: -1, createdAt: -1 })
    .limit(12)
    .toArray() as Promise<PublishedFeedback[]>;
}