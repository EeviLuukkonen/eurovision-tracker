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
