import type { OfficialResult } from './officialResult';

export type ContestYear = {
  id: number;
  year: number;
  country: string;
  city: string;
  arena: string;
  slogan: string;
};

export type YearOverview = {
  contest: ContestYear;
  top3: OfficialResult[];
  winner: OfficialResult | null;
  juryWinner: OfficialResult | null;
  televoteWinner: OfficialResult | null;
  contestantsCount: number;
};