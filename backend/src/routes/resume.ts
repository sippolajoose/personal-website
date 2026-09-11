import { Router } from 'express';
import { getProfile } from '../services/profileService';
import { streamProfilePdf } from '../services/pdfService';

export const resumeRouter = Router();

resumeRouter.get('/resume/pdf', async (_request, response, next) => {
  try {
    const profile = await getProfile();
    streamProfilePdf(response, profile);
  } catch (error) {
    next(error);
  }
});
