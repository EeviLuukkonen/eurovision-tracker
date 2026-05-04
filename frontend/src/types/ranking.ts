export type RankingEntry = {
  entryId: number;
  position: number;
};

export type RankingByYear = {
  year: number;
  entries: RankingEntry[];
};

export type RankingAnalysisResponse = {
  analysis: string;
};

export type MyRankingSummary = {
  year: number;
  rankedCount: number;
  totalEntries: number;
  isComplete: boolean;
  updatedAt: string;
};