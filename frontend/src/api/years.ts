import type { ContestYear, YearOverview } from '../types/year';
import type { ApiResponse } from '../types/api/response';

export const fetchYears = async (): Promise<ContestYear[]> => {
  const response = await fetch('/api/years');
  let json: ApiResponse<ContestYear[]> | null = null;

  try {
    json = (await response.json()) as ApiResponse<ContestYear[]>;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.error ?? `Request failed with status ${response.status}`);
  }

  if (!json?.success || !json.data) {
    throw new Error(json?.error ?? 'Failed to load years');
  }

  return json.data;
};

export const fetchYearOverview = async (year: number): Promise<YearOverview> => {
  const response = await fetch(`/api/years/${year}`);
  let json: ApiResponse<YearOverview> | null = null;

  try {
    json = (await response.json()) as ApiResponse<YearOverview>;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.error ?? `Request failed with status ${response.status}`);
  }

  if (!json?.success || !json.data) {
    throw new Error(json?.error ?? `Failed to load year overview for ${year}`);
  }

  return json.data;
};
