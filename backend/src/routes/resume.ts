import { Router } from 'express';
import { getProfile } from '../services/profileService';
import { streamProfilePdf } from '../services/pdfService';

export const resumeRouter = Router();

resumeRouter.get('/resume/pdf', async (request, response, next) => {
  try {
    const requestedLocale = request.query.locale;

    if (requestedLocale !== undefined && requestedLocale !== 'fi' && requestedLocale !== 'en') {
      response.status(400).json({ error: 'locale must be fi or en' });
      return;
    }

    const profile = await getProfile();
    streamProfilePdf(response, profile, requestedLocale ?? 'en');
  } catch (error) {
    next(error);
  }
});
