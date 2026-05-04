import { prisma } from '../config/database';
import type { ApiResponse } from '../types';

export type MyRankingSummary = {
  year: number;
  rankedCount: number;
  totalEntries: number;
  isComplete: boolean;
  updatedAt: Date;
};

export const getMyRankingsResponse = async (userId: number): Promise<ApiResponse<MyRankingSummary[]>> => {
  const [rankings, entryCounts] = await Promise.all([
    prisma.ranking.findMany({
      where: { userId },
      orderBy: { year: 'desc' },
      include: {
        _count: {
          select: { entries: true },
        },
      },
    }),
    prisma.entry.groupBy({
      by: ['year'],
      _count: { id: true },
    }),
  ]);

  const totalEntriesByYear = new Map(
    entryCounts.map((row) => [row.year, row._count.id])
  );

  return {
    success: true,
    data: rankings.map((ranking) => {
      const rankedCount = ranking._count.entries;
      const totalEntries = totalEntriesByYear.get(ranking.year) ?? 0;
      return {
        year: ranking.year,
        rankedCount,
        totalEntries,
        isComplete: totalEntries > 0 && rankedCount === totalEntries,
        updatedAt: ranking.updatedAt,
      };
    }),
  };
};
