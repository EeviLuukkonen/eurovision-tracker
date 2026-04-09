import type { ContestYear, YearOverview } from '../types/year';
import type { ApiResponse } from '../types/api/response';

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

export const fetchYearOverview = async (year: number): Promise<YearOverview> => {
  const response = await fetch(`/api/years/${year}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<YearOverview>;

  if (!json.success || !json.data) {
    throw new Error(json.error ?? `Failed to load year overview for ${year}`);
  }

  return json.data;
};
