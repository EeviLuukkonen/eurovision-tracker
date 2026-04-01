export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export type OfficialResultResponse = {
  entryId: number;
  rank: number;
  juryPoints: number | null;
  televotePoints: number | null;
  totalPoints: number;
  entry: {
    id: number;
    year: number;
    country: string;
    artist: string;
    song: string;
    youtubeUrl: string | null;
  };
};

export type YearOverviewResponse = {
  contest: {
    id: number;
    year: number;
    country: string;
    city: string;
    arena: string;
    slogan: string;
  };
  top3: OfficialResultResponse[];
  winner: OfficialResultResponse | null;
  juryWinner: OfficialResultResponse | null;
  televoteWinner: OfficialResultResponse | null;
  contestantsCount: number;
};