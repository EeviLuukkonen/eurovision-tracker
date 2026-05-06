import { getOfficialResultsByYear } from '@/api/officialResults';
import { OfficialResultRow } from '@/components/EntryCard';
import { ErrorAlert } from '@/components/ErrorAlert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { OfficialResult } from '@/types/officialResult';
import { useQuery } from '@tanstack/react-query';
import { InfoIcon, Loader2Icon } from 'lucide-react';
import { useParams } from 'react-router-dom';

const OfficialResultsPage = () => {
  const { year } = useParams<{ year: string }>();

  const {
    data: officialResults = [],
    isLoading,
    error,
    refetch,
  } = useQuery<OfficialResult[], Error>({
    queryKey: ['officialResults', year],
    queryFn: () => getOfficialResultsByYear(Number(year)),
    enabled: Boolean(year),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Eurovision {year}</p>
          <h1 className="text-2xl font-semibold">Official Results</h1>
        </div>
        <div className="flex min-h-56 items-center justify-center">
          <Loader2Icon className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Eurovision {year}</p>
          <h1 className="text-2xl font-semibold">Official Results</h1>
        </div>
        <ErrorAlert error={error} title="Could not load official results" onRetry={() => void refetch()} />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Eurovision {year}</p>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Official Results</h1>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="About this scoreboard"
              >
                <InfoIcon className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Note</p>
              <p className="mt-2 text-sm text-foreground/80">
                Grand Final entries are shown with their official final results. Non-qualified entries never competed in the final — their placement here is based on semi-final points, so their points are not directly comparable to the finalists.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {officialResults.length === 0 && (
        <p className="text-muted-foreground text-sm">No official results available.</p>
      )}

      {officialResults.length > 0 && (() => {
        return (
          <div className="min-w-0">
            <div className="mb-2 grid grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.35fr)_4rem_4rem_4.5rem] items-center gap-3 px-3 md:grid-cols-[2rem_minmax(0,1.05fr)_minmax(0,1.7fr)_4rem_4rem_4.5rem]">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Pos</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-left">Country</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-left">Artist & Song</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Jury</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Tele</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Total</span>
            </div>

            <ol className="min-w-0">
              {officialResults.map((result) => (
              <OfficialResultRow key={result.entryId} result={result} />
              ))}
            </ol>
          </div>
        );
      })()}
    </main>
  );
};

export default OfficialResultsPage;
