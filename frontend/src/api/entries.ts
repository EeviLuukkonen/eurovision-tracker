import type { ApiResponse, Entry } from '../types/entry';

export const fetchEntriesByYear = async (year: number): Promise<Entry[]> => {
  const response = await fetch(`/api/entrys/${year}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<Entry[]>;

  if (!json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to load entries');
  }

  return json.data;
};
