import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';

describe('GET /api/openapi.json', () => {
  it('returns the OpenAPI document', async () => {
    const response = await request(createApp()).get('/api/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.1.0');
    expect(response.body.paths).toHaveProperty('/profile');
    expect(response.body.paths).toHaveProperty('/feedback');
    expect(response.body.paths).not.toHaveProperty('/resume/pdf');
    expect(response.body.components.schemas.ExperienceEntry.properties).toHaveProperty('highlights');
    expect(response.body.components.schemas.ExperienceEntry.properties).toHaveProperty('technologies');
    expect(response.body.components.schemas.EducationEntry.properties).toHaveProperty('summary');
  });

  it('does not expose the disabled CV export endpoint', async () => {
    const response = await request(createApp()).get('/api/resume/pdf');

    expect(response.status).toBe(404);
  });
});
