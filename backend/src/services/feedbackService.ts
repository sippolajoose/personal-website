import { z } from 'zod';
import { createFeedbackDocument, getPublishedFeedbackDocuments } from '../repositories/feedbackRepository';

export const feedbackInputSchema = z
  .object({
    message: z.string().trim().min(1).max(1000),
    displayName: z
      .string()
      .trim()
      .max(80)
      .optional()
      .transform((value) => value || undefined),
    locale: z.enum(['fi', 'en']),
    publishConsent: z.boolean()
  })
  .strict();

export type FeedbackInput = z.infer<typeof feedbackInputSchema>;

export async function submitFeedback(input: FeedbackInput): Promise<void> {
  await createFeedbackDocument({
    ...input,
    status: 'pending',
    featured: false,
    createdAt: new Date()
  });
}

export async function getPublishedFeedback() {
  return getPublishedFeedbackDocuments();
}