export type FeedbackLocale = 'fi' | 'en';
export type FeedbackStatus = 'pending' | 'approved' | 'rejected';

export interface FeedbackDocument {
  message: string;
  displayName?: string;
  locale: FeedbackLocale;
  publishConsent: boolean;
  status: FeedbackStatus;
  featured: boolean;
  createdAt: Date;
}