import type { ApiResponse, ContestYear } from '../types/year';

export const fetchYears = async (): Promise<ContestYear[]> => {
  const response = await fetch('/api/years');

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<ContestYear[]>;

  if (!json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to load years');
  }

  return json.data;
};
