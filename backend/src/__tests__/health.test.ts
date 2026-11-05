import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const response = await request(createApp()).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it.each(['http://localhost:5173', 'http://127.0.0.1:5173'])(
    'allows the local frontend origin %s',
    async (origin) => {
      const response = await request(createApp())
        .get('/api/health')
        .set('Origin', origin);

      expect(response.headers['access-control-allow-origin']).toBe(origin);
    }
  );
});
