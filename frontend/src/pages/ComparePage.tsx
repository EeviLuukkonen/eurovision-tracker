import { fetchEntriesByYear } from "@/api/entries";
import { getOfficialResultsByYear } from "@/api/officialResults";
import { getRankingByYear } from "@/api/rankings";
import { useAuth } from "@/context/AuthContext";
import { getCountryName } from "@/lib/countries";
import { sortAndPopulateEntries } from "@/lib/rankingHelper";
import type { Entry } from "@/types/entry";
import type { OfficialResult } from "@/types/officialResult";
import type { RankingByYear } from "@/types/ranking";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useParams } from "react-router-dom";

type CompareRowProps = {
  position: number;
  countryCode: string;
  nonQualified?: boolean;
};

const CompareRow = ({ position, countryCode, nonQualified }: CompareRowProps) => {
  return (
    <li className="flex items-center gap-3 border-x border-b border-white/20 bg-background pl-3 pr-4 py-2 first:rounded-t first:border-t last:rounded-b">
      <span className="w-5 text-xs font-bold text-muted-foreground text-right tabular-nums shrink-0">
        {position}
      </span>
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{ width: "1.5rem", height: "1.1rem", objectFit: "cover" }}
        className="rounded-sm shadow-sm shrink-0"
      />
      <span className="text-sm font-medium truncate flex-1 flex items-center gap-2">{getCountryName(countryCode)}
        {nonQualified && (
          <span className="shrink-0 rounded border border-muted-foreground/40 px-1 text-[10px] font-bold leading-tight text-muted-foreground">
            NQ
          </span>
        )}
      </span>
    </li>
  );
};


const ComparePage = () => {
  const { year } = useParams<{ year: string }>();
  const { isAuthenticated, isAuthLoading } = useAuth();
  
  const officialResultsQuery = useQuery<OfficialResult[], Error>({
    queryKey: ['officialResults', year],
    queryFn: () => getOfficialResultsByYear(Number(year)),
    enabled: Boolean(year)
  });

  const userRankingQuery = useQuery<RankingByYear, Error>({
    queryKey: ['userRanking', year],
    queryFn: () => getRankingByYear(Number(year)),
    enabled: Boolean(year)
  });

  const entriesQuery = useQuery<Entry[], Error>({
    queryKey: ["entries", year],
    queryFn: () => fetchEntriesByYear(Number(year)),
    enabled: Boolean(year) && isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const officialResults = officialResultsQuery.data ?? [];
  const rankingEntries = userRankingQuery.data?.entries ?? [];
  const entries = entriesQuery.data ?? [];

  const userRanking = sortAndPopulateEntries(entries, rankingEntries);
  const nonQualifiedEntryIds = new Set(
    officialResults.filter((result) => !result.finalist).map((result) => result.entryId)
  );

  if (officialResultsQuery.isLoading || userRankingQuery.isLoading || entriesQuery.isLoading || isAuthLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex min-h-50 items-center justify-center">
          <Loader2Icon className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (officialResultsQuery.isError || userRankingQuery.isError || entriesQuery.isError) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-muted-foreground">Could not load compare data.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Eurovision {year}</p>
        <h1 className="text-2xl font-semibold">Compare Rankings</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your Ranking</h2>
          {!isAuthenticated || userRanking.length === 0 ? (
            <p className="text-sm text-muted-foreground">No user ranking available.</p>
          ) : (
            <ol>
              {userRanking.map((entry, index) => (
                <CompareRow
                  key={entry.id}
                  position={index + 1}
                  countryCode={entry.country}
                  nonQualified={nonQualifiedEntryIds.has(entry.id)}
                />
              ))}
            </ol>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Official</h2>
          {officialResults.length === 0 ? (
            <p className="text-sm text-muted-foreground">No official results available.</p>
          ) : (
            <ol>
              {officialResults.map((result) => (
                <CompareRow key={result.entryId} position={result.rank} countryCode={result.entry.country} nonQualified={!result.finalist} />
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
};

export default ComparePage;