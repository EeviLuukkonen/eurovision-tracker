import type { Entry } from '../types/entry';
import type { ApiResponse } from '../types/api/response';

export const fetchEntriesByYear = async (year: number): Promise<Entry[]> => {
  const response = await fetch(`/api/entrys/${year}`);

  let json: ApiResponse<Entry[]> | null = null;

  try {
    json = (await response.json()) as ApiResponse<Entry[]>;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.error ?? `Request failed with status ${response.status}`);
  }

  if (!json?.success || !json?.data) {
    throw new Error(json?.error ?? 'Failed to load entries');
  }

  return json.data;
};