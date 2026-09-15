import { Router } from 'express';
import { feedbackInputSchema, submitFeedback } from '../services/feedbackService';

export const feedbackRouter = Router();

feedbackRouter.post('/feedback', async (request, response, next) => {
  const parsedInput = feedbackInputSchema.safeParse(request.body);

  if (!parsedInput.success) {
    response.status(400).json({ error: 'message, displayName, locale, or publishConsent is invalid' });
    return;
  }

  try {
    await submitFeedback(parsedInput.data);
    response.status(201).json({ status: 'pending' });
  } catch (error) {
    next(error);
  }
});