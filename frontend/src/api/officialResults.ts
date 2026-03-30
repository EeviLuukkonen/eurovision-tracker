import type { ApiResponse } from "../types/api/response";
import type { OfficialResult } from "../types/officialResult";


export const getOfficialResultsByYear = async (year: number): Promise<OfficialResult[]> => {
  const response = await fetch(`/api/results/${year}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<OfficialResult[]>;

  if (!json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to load official results');
  }

  return json.data;
};