import { Router } from 'express';
import { prisma } from '../config/database';
import { ApiResponse } from '../types';

const router = Router();

type OfficialResultResponse = {
  entryId: number;
  rank: number;
  juryPoints: number | null;
  televotePoints: number | null;
  totalPoints: number;
  entry: {
    id: number;
    year: number;
    country: string;
    artist: string;
    song: string;
    youtubeUrl: string | null;
  };
};

// GET /api/results/:year - Get official results for a given year
router.get('/:year', async (req, res) => {
  const year = Number(req.params.year);

  const results = await prisma.officialResult.findMany({
    where: {
      entry: {
        year,
      },
    },
    orderBy: { rank: 'asc' },
    select: {
      entryId: true,
      rank: true,
      juryPoints: true,
      televotePoints: true,
      totalPoints: true,
      entry: {
        select: {
          id: true,
          year: true,
          country: true,
          artist: true,
          song: true,
          youtubeUrl: true,
        },
      },
    },
  });

  const response: ApiResponse<OfficialResultResponse[]> = {
    success: true,
    data: results,
  };

  res.json(response);
});

export default router;