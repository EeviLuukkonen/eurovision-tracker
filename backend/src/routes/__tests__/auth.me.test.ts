import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = 'test-secret-that-is-long-enough-for-jwt';

const USER = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  password: 'hashed',
};

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
});

beforeEach(() => {
  vi.clearAllMocks();
});

const validCookie = () => {
  const token = jwt.sign({ sub: USER.id }, JWT_SECRET, { expiresIn: '7d' });
  return `token=${token}`;
};

describe('GET /api/auth/me', () => {
  it('returns 401 with no cookie', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  it('returns 401 with an invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', 'token=this.is.garbage');

    expect(res.status).toBe(401);
  });

  it('returns 200 with user data when authenticated', async () => {
    findUnique.mockResolvedValue(USER as never);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', validCookie());

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { id: USER.id, email: USER.email, username: USER.username },
    });
  });
});
