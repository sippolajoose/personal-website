import { Router } from 'express';
import { openApiDocument } from '../openapi';

export const openApiRouter = Router();

openApiRouter.get('/openapi.json', (_request, response) => {
  response.json(openApiDocument);
});
