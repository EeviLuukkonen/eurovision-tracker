import { Router } from 'express';
import { Contest } from '@prisma/client';
import { prisma } from '../config/database';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/years - Get all available years
router.get('/', async (_req, res) => {
  const contests = await prisma.contest.findMany({
    orderBy: { year: 'desc' },
  });

  const response: ApiResponse<Contest[]> = {
    success: true,
    data: contests,
  };

  res.json(response);
});

export default router;
