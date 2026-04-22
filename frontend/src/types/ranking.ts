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