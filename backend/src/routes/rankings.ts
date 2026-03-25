import { Router } from 'express';
import { prisma } from '../config/database';
import { ApiResponse } from '../types';
import { requireAuth } from '../middleware/requireAuth';
import { createHttpError } from '../utils/httpError';

const router = Router();

type RankingEntryPayload = {
  entryId: number;
  position: number;
};

type RankingResponse = {
  year: number;
  entries: RankingEntryPayload[];
};

const parseRankingEntries = (body: unknown): RankingEntryPayload[] => {
  if (typeof body !== 'object' || body === null) {
    throw createHttpError(400, 'entries is required and must be a non-empty array');
  }

  const entries = (body as Record<string, unknown>).entries;

  if (typeof entries === 'undefined') {
    throw createHttpError(400, 'entries is required and must be a non-empty array');
  }

  if (!Array.isArray(entries)) {
    throw createHttpError(400, 'entries must be an array');
  }

  if (entries.length === 0) {
    throw createHttpError(400, 'entries must not be empty');
  }

  return entries.map((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      throw createHttpError(400, 'Each ranking entry must be an object');
    }

    const { entryId, position } = entry as Record<string, unknown>;

    if (
      typeof entryId !== 'number' || !Number.isInteger(entryId) ||
      typeof position !== 'number' || !Number.isInteger(position)
    ) {
      throw createHttpError(400, 'Each ranking entry must include integer entryId and position');
    }

    return { entryId, position };
  });
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
  const entries = parseRankingEntries(req.body);

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

    await tx.rankingEntry.createMany({
      data: entries.map((entry) => ({
        rankingId: upsertedRanking.id,
        entryId: entry.entryId,
        position: entry.position,
      })),
    });

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