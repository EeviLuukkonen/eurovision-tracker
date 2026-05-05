import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';

vi.mock('../../config/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '../../config/database';
import app from '../../app';

const findUnique = vi.mocked(prisma.user.findUnique);

const PLAIN_PASSWORD = 'password123';
let USER: { id: number; email: string; username: string; password: string };

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-jwt';
  USER = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    password: await bcrypt.hash(PLAIN_PASSWORD, 10),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/auth/login', () => {
  it('returns 401 when user is not found', async () => {
    findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'doesnot@exist.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid email or password/i);
  });

  it('returns 401 when password is incorrect', async () => {
    findUnique.mockResolvedValue(USER as never);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid email or password/i);
  });

  it('returns 200 with user data and sets a cookie on successful login', async () => {
    findUnique.mockResolvedValue(USER as never);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: PLAIN_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { id: 1, email: 'test@example.com', username: 'testuser' },
    });
    expect(res.headers['set-cookie']).toBeDefined();
  });
});