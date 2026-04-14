import type { Entry } from "./entry";

export type OfficialResult = {
  entryId: number;
  rank: number;
  juryPoints: number | null;
  televotePoints: number | null;
  totalPoints: number;
  entry: Entry;
  finalist: boolean;
};