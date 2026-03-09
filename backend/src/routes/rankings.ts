import { Router } from 'express';
import { prisma } from '../config/database';
import { ApiResponse } from '../types';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

type RankingEntryPayload = {
  entryId: number;
  position: number;
};

type RankingResponse = {
  year: number;
  entries: RankingEntryPayload[];
};

// GET /api/rankings/:year - Get ranking for a given year
router.get('/:year', requireAuth, async (req, res) => {
  const year = Number(req.params.year);
  const userId = res.locals.userId as number;

  const ranking = await prisma.ranking.findUnique({
    where: {
      userId_year: {
        userId,
        year,
      },
    },
    include: {
      entries: {
        orderBy: { position: 'asc' },
        select: {
          entryId: true,
          position: true,
        },
      },
    },
  });

  const response: ApiResponse<RankingResponse> = {
    success: true,
    data: {
      year,
      entries: ranking?.entries ?? [],
    },
  };

  res.json(response);
});

// PUT /api/rankings/:year - Create or update ranking for a given year
router.put('/:year', requireAuth, async (req, res) => {
  const year = Number(req.params.year);
  const userId = res.locals.userId as number;
  const entries = (req.body?.entries ?? []) as RankingEntryPayload[];

  const ranking = await prisma.$transaction(async (tx) => {
    const upsertedRanking = await tx.ranking.upsert({
      where: {
        userId_year: {
          userId,
          year,
        },
      },
      create: {
        userId,
        year,
      },
      update: {
        year // updated so updatedAt will change, even though year stays the same...
      },
    });

    await tx.rankingEntry.deleteMany({
      where: { rankingId: upsertedRanking.id },
    });

    if (entries.length > 0) {
      await tx.rankingEntry.createMany({
        data: entries.map((entry) => ({
          rankingId: upsertedRanking.id,
          entryId: entry.entryId,
          position: entry.position,
        })),
      });
    }

    return tx.ranking.findUnique({
      where: { id: upsertedRanking.id },
      include: {
        entries: {
          orderBy: { position: 'asc' },
          select: {
            entryId: true,
            position: true,
          },
        },
      },
    });
  });

  const response: ApiResponse<RankingResponse> = {
    success: true,
    data: {
      year,
      entries: ranking?.entries ?? [],
    },
  };

  res.json(response);
});

export default router;