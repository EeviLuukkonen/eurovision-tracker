import { Router } from 'express';
import { Contest } from '@prisma/client';
import { prisma } from '../config/database';
import { ApiResponse, YearOverviewResponse } from '../types';
import { getYearOverviewData } from '../services/years';
import { createHttpError } from '../utils/httpError';
import { FIRST_CONTEST_YEAR } from '../config/constants';

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

// GET /api/years/:year - Get overview for a specific year
router.get('/:year', async (req, res) => {
  const year = Number(req.params.year);

  if (!Number.isInteger(year) || year < FIRST_CONTEST_YEAR) {
    throw createHttpError(400, 'Invalid year parameter');
  }

  const overview = await getYearOverviewData(year);

  const response: ApiResponse<YearOverviewResponse> = {
    success: true,
    data: overview,
  };

  res.json(response);
});

export default router;
