import type { ApiResponse } from '../types/api/response';
import type { RankingByYear } from '../types/ranking';

export const getRankingByYear = async (year: number): Promise<RankingByYear> => {
  const response = await fetch(`/api/rankings/${year}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<RankingByYear>;

  if (!json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to load ranking');
  }

  return json.data;
};

export const saveRankingByYear = async (year: number, entries: { entryId: number; position: number }[]): Promise<void> => {
  const response = await fetch(`/api/rankings/${year}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entries }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<RankingByYear>;

  if (!json.success) {
    throw new Error(json.error ?? 'Failed to save ranking');
  }
};