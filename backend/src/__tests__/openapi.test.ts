import request from 'supertest';
import { createApp } from '../app';

describe('GET /api/openapi.json', () => {
  it('returns the OpenAPI document', async () => {
    const response = await request(createApp()).get('/api/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.1.0');
    expect(response.body.paths).toHaveProperty('/profile');
    expect(response.body.paths).toHaveProperty('/resume/pdf');
  });
});
