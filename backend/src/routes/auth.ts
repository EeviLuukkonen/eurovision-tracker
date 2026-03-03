import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../config/database';
import { ApiResponse } from '../types';

const router = Router();

type HttpError = Error & {
  statusCode: number;
};

const createHttpError = (statusCode: number, message: string): HttpError => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
};

type AuthUserResponse = {
  id: number;
  email: string;
  username: string;
};

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    throw createHttpError(400, 'Email, username and password are required');
  }

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

  res.status(201).json(response);
});

// POST /api/auth/login - Log in a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError(400, 'Email and password are required');
  }

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

  res.json(response);
});

export default router;