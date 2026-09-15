import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../app';

const insertOne = vi.hoisted(() => vi.fn().mockResolvedValue({ acknowledged: true }));

vi.mock('../db/mongo', () => ({
  getDatabase: vi.fn(async () => ({
    collection: () => ({ insertOne })
  }))
}));

describe('POST /api/feedback', () => {
  beforeEach(() => {
    insertOne.mockClear();
  });

  it('rejects an empty message', async () => {
    const response = await request(createApp()).post('/api/feedback').send({
      message: '   ',
      locale: 'fi',
      publishConsent: false
    });

    expect(response.status).toBe(400);
    expect(insertOne).not.toHaveBeenCalled();
  });

  it('stores valid feedback as pending', async () => {
    const response = await request(createApp()).post('/api/feedback').send({
      message: 'Hieno portfolio!',
      displayName: 'Ada',
      locale: 'fi',
      publishConsent: true
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ status: 'pending' });
    expect(insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Hieno portfolio!',
        displayName: 'Ada',
        locale: 'fi',
        publishConsent: true,
        status: 'pending',
        featured: false,
        createdAt: expect.any(Date)
      })
    );
  });
});