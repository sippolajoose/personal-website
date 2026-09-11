import { Router } from 'express';
import { getProfile } from '../services/profileService';

export const profileRouter = Router();

profileRouter.get('/profile', async (_request, response, next) => {
  try {
    const profile = await getProfile();
    response.json(profile);
  } catch (error) {
    next(error);
  }
});
