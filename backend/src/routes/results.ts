import { Router } from 'express';
import { ApiResponse } from '../types';
import { OfficialResultResponse } from '../types';
import { getOfficialResultsByYearData } from '../services/officialResults';
import { createHttpError } from '../utils/httpError';
import { FIRST_CONTEST_YEAR } from '../config/constants';

const router = Router();

// GET /api/results/:year - Get official results for a given year
router.get('/:year', async (req, res) => {
  const year = Number(req.params.year);

  if (!Number.isInteger(year) || year < FIRST_CONTEST_YEAR) {
    throw createHttpError(400, 'Invalid year parameter');
  }

  const results = await getOfficialResultsByYearData(year);

  const response: ApiResponse<OfficialResultResponse[]> = {
    success: true,
    data: results,
  };

  res.json(response);
});

export default router;