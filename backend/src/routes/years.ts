import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /api/years - Get all available years
router.get('/', async (_req: Request, res: Response) => {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { year: 'desc' }
    });

    res.json({
      success: true,
      data: contests
    });
  } catch (error) {
    console.error('Error fetching years:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
