import { fetchEntriesByYear } from "@/api/entries";
import { getOfficialResultsByYear } from "@/api/officialResults";
import { getRankingAnalysisByYear, getRankingByYear } from "@/api/rankings";
import { useAuth } from "@/context/AuthContext";
import { getCountryName } from "@/lib/countries";
import { sortAndPopulateEntries } from "@/lib/rankingHelper";
import type { Entry } from "@/types/entry";
import type { OfficialResult } from "@/types/officialResult";
import type { RankingByYear } from "@/types/ranking";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, BotIcon, ChevronDownIcon, ChevronUpIcon, Loader2Icon } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { useParams } from "react-router-dom";

type CompareRowProps = {
  position: number;
  countryCode: string;
  nonQualified?: boolean;
  diff?: number;
};

const CompareRow = ({ position, countryCode, nonQualified, diff }: CompareRowProps) => {
  const diffIndicator =
    diff === undefined
      ? null
      : diff === 0
        ? <ArrowRightIcon className="h-3.5 w-3.5 text-blue-500" />
        : diff > 0
          ? (
            <span className="inline-flex items-center gap-1 text-green-500">
              <ArrowUpIcon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold leading-tight tabular-nums">{diff}</span>
            </span>
          )
          : (
            <span className="inline-flex items-center gap-1 text-red-500">
              <ArrowDownIcon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold leading-tight tabular-nums">{Math.abs(diff)}</span>
            </span>
          );

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
      <div className="min-w-0 flex flex-1 items-center gap-2">
        <span className="truncate text-sm font-medium">{getCountryName(countryCode)}</span>
        {nonQualified && (
          <span className="shrink-0 rounded border border-muted-foreground/40 px-1 text-[10px] font-bold leading-tight text-muted-foreground">
            NQ
          </span>
        )}
      </div>
      {diffIndicator && <span className="ml-auto flex shrink-0 items-center">{diffIndicator}</span>}
    </li>
  );
};


const ComparePage = () => {
  const { year } = useParams<{ year: string }>();
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  
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

  const rankingEntries = userRankingQuery.data?.entries ?? [];
  const officialResults = officialResultsQuery.data ?? [];

  const analysisQuery = useQuery<string, Error>({
    queryKey: ["rankingAnalysis", year],
    queryFn: () => getRankingAnalysisByYear(Number(year)),
    enabled: Boolean(year) && isAuthenticated && isAnalysisOpen && rankingEntries.length > 0 && officialResults.length > 0,
    staleTime: 1000 * 60 * 15,
  });

  const entries = entriesQuery.data ?? [];

  const userRanking = sortAndPopulateEntries(entries, rankingEntries);
  const nonQualifiedEntryIds = new Set(
    officialResults.filter((result) => !result.finalist).map((result) => result.entryId)
  );
  const officialRankLookup = new Map(officialResults.map((result) => [result.entryId, result.rank]));
  const canRequestAnalysis = isAuthenticated && userRanking.length > 0 && officialResults.length > 0;

  const handleAnalysisToggle = () => {
    if (!canRequestAnalysis) {
      return;
    }

    setIsAnalysisOpen((current) => !current);
  };

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
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-background/45 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-muted-foreground">
              <BotIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Want AI takeaways?</p>
              <p className="text-xs text-muted-foreground">Get a quick read on your biggest ranking gaps and taste patterns.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAnalysisToggle}
            disabled={!canRequestAnalysis}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm font-medium text-foreground transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{isAnalysisOpen ? "Hide AI analysis" : "Get AI analysis"}</span>
            {isAnalysisOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isAnalysisOpen && (
        <section className="mb-8 rounded-xl border border-white/12 bg-background/55 p-4 shadow-sm backdrop-blur-sm md:p-5">
          <div className="mb-3 flex items-start gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-2 text-muted-foreground">
              <BotIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Your Eurovision {year} Taste vs. Reality</h2>
              <p className="text-xs text-muted-foreground">A quick AI read based on your ranking and the official results.</p>
            </div>
          </div>

          {!isAuthenticated ? (
            <p className="text-sm leading-relaxed text-muted-foreground">Log in to get your AI ranking overview.</p>
          ) : userRanking.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted-foreground">Create your ranking first to unlock AI analysis.</p>
          ) : analysisQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              <span>Analyzing your ranking...</span>
            </div>
          ) : analysisQuery.isError ? (
            <p className="text-sm leading-relaxed text-muted-foreground">Could not generate AI analysis right now. Please try again.</p>
          ) : (
            <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  em: ({ children }) => <em className="italic text-foreground/85">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
                  li: ({ children }) => <li>{children}</li>,
                }}
              >
                {analysisQuery.data ?? ""}
              </ReactMarkdown>
            </div>
          )}
        </section>
      )}

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
                  diff={officialRankLookup.has(entry.id) ? officialRankLookup.get(entry.id)! - (index + 1) : undefined}
                />
              ))}
            </ol>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Official ranking</h2>
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