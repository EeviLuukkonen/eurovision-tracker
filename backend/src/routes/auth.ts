import { Router, type CookieOptions } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { ApiResponse } from '../types';
import { requireAuth } from '../middleware/requireAuth';
import { createHttpError } from '../utils/httpError';

const router = Router();

const createToken = (userId: number) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};

const getCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});

type AuthUserResponse = {
  id: number;
  email: string;
  username: string;
};

type RegisterBody = {
  email: string;
  username: string;
  password: string;
};

type LoginBody = {
  email: string;
  password: string;
};

const parseRegisterBody = (body: unknown): RegisterBody => {
  if (typeof body !== 'object' || body === null) {
    throw createHttpError(400, 'Email, username and password are required');
  }
  const { email, username, password } = body as Record<string, unknown>;
  if (
    typeof email !== 'string' || !email ||
    typeof username !== 'string' || !username ||
    typeof password !== 'string' || !password
  ) {
    throw createHttpError(400, 'Email, username and password are required');
  }
  return { email, username, password };
};

const parseLoginBody = (body: unknown): LoginBody => {
  if (typeof body !== 'object' || body === null) {
    throw createHttpError(400, 'Email and password are required');
  }
  const { email, password } = body as Record<string, unknown>;
  if (
    typeof email !== 'string' || !email ||
    typeof password !== 'string' || !password
  ) {
    throw createHttpError(400, 'Email and password are required');
  }
  return { email, password };
};

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  const { email, username, password } = parseRegisterBody(req.body);


  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  const response: ApiResponse<AuthUserResponse> = {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };

  const token = createToken(user.id);
  res.cookie('token', token, getCookieOptions());
  res.status(201).json(response);
});

// POST /api/auth/login - Log in a user
router.post('/login', async (req, res) => {
  const { email, password } = parseLoginBody(req.body);


  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const response: ApiResponse<AuthUserResponse> = {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };

  const token = createToken(user.id);
  res.cookie('token', token, getCookieOptions());
  res.json(response);
});

// POST /api/auth/logout - Log out the user
router.post('/logout', (_req, res) => {
  res.clearCookie('token', getCookieOptions());
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me - Get current user info
router.get('/me', requireAuth, async (_req, res) => {
  const userId = res.locals.userId as number;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const response: ApiResponse<AuthUserResponse> = {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };

  res.json(response);
});

export default router;