import { prisma } from '../config/database';
import type { OfficialResultResponse } from '../types';

export const getOfficialResultsByYearData = async (year: number): Promise<OfficialResultResponse[]> => {
  return prisma.officialResult.findMany({
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
};