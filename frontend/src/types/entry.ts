export type Entry = {
  id: number;
  year: number;
  country: string;
  artist: string;
  song: string;
  youtubeUrl: string | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
