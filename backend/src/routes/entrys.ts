import { Router } from 'express';
import { Entry } from '@prisma/client';
import { prisma } from '../config/database';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/entrys/:year - Get all entrys for a given year
router.get('/:year', async (req, res) => {
  const year = Number(req.params.year);

  const entrys = await prisma.entry.findMany({
    where: { year },
    orderBy: { country: 'asc' },
  });

  const response: ApiResponse<Entry[]> = {
    success: true,
    data: entrys,
  };

  res.json(response);
});

export default router;