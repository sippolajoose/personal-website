import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../app';

const insertOne = vi.hoisted(() => vi.fn().mockResolvedValue({ acknowledged: true }));
const toArray = vi.hoisted(() =>
  vi.fn().mockResolvedValue([
    {
      message: 'Hieno portfolio!',
      displayName: 'Ada',
      locale: 'fi',
      featured: true,
      createdAt: new Date('2026-09-15T10:00:00.000Z')
    }
  ])
);
const find = vi.hoisted(() =>
  vi.fn(() => ({
    sort: () => ({
      limit: () => ({ toArray })
    })
  }))
);

vi.mock('../db/mongo', () => ({
  getDatabase: vi.fn(async () => ({
    collection: () => ({ insertOne, find })
  }))
}));

describe('POST /api/feedback', () => {
  beforeEach(() => {
    insertOne.mockClear();
    find.mockClear();
    toArray.mockClear();
  });

  it('returns only published feedback', async () => {
    const response = await request(createApp()).get('/api/feedback');

    expect(response.status).toBe(200);
    expect(response.body.feedback).toHaveLength(1);
    expect(response.body.feedback[0]).toMatchObject({ message: 'Hieno portfolio!', displayName: 'Ada' });
    expect(find).toHaveBeenCalledWith(
      { status: 'approved', publishConsent: true },
      { projection: { _id: 0, message: 1, displayName: 1, locale: 1, featured: 1, createdAt: 1 } }
    );
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