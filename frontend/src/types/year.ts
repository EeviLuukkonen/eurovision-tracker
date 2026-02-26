export type ContestYear = {
  id: number;
  year: number;
  country: string;
  city: string;
  arena: string;
  slogan: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
