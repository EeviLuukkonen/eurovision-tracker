import { useQuery, useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart3Icon, ListOrderedIcon, Loader2Icon, TrophyIcon } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { fetchYears, fetchYearOverview } from '../api/years';
import { getCountryName } from '@/lib/countries';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ErrorAlert';
import type { ContestYear } from '../types/year';

const FEATURES = [
  {
    icon: ListOrderedIcon,
    title: 'Rank',
    description: 'Order every entry from your favourite to least favourite.',
  },
  {
    icon: BarChart3Icon,
    title: 'Compare',
    description: 'See how your ranking differs from the official results.',
  },
  {
    icon: TrophyIcon,
    title: 'Explore',
    description: 'Browse contest data and explore the scoreboards across the years.',
  },
];

const HomePage = () => {
  const {
    data: years = [],
    isLoading: isYearsLoading,
    error: yearsError,
    refetch,
  } = useQuery<ContestYear[], Error>({
    queryKey: ['years'],
    queryFn: fetchYears,
    staleTime: 1000 * 60 * 5,
  });

  const sortedYears = [...years].sort((a, b) => b.year - a.year);

  const overviewResults = useQueries({
    queries: sortedYears.map((contest) => ({
      queryKey: ['yearOverview', String(contest.year)],
      queryFn: () => fetchYearOverview(contest.year),
      staleTime: 1000 * 60 * 10,
    })),
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-5xl font-bold mb-6">ESCoreboard</h1>
        <p className="max-w-2xl text-base text-muted-foreground mb-8">
          Your Eurovision ranking app — build personal rankings for every contest and compare your picks against the official scoreboard.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-3 items-start rounded-xl border border-white/10 bg-background/40 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/8">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contests</p>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {isYearsLoading && (
          <div className="flex min-h-56 items-center justify-center">
            <Loader2Icon className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        )}
        {yearsError && (
          <ErrorAlert error={yearsError} title="Could not load contests" onRetry={() => void refetch()} />
        )}

        {!isYearsLoading && !yearsError && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedYears.map((contest, idx) => {
              const overview = overviewResults[idx]?.data;
              const isOverviewLoading = overviewResults[idx]?.isLoading ?? true;
              const winner = overview?.winner;

              return (
                <div
                  key={contest.id}
                  className="relative flex flex-col overflow-hidden rounded-xl border border-white/20 bg-background transition-colors hover:border-white/40"
                >
                  <Link to={`/year/${contest.year}`} className="absolute inset-0 z-0" aria-label={`Eurovision ${contest.year} overview`} />
                  <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                    <ReactCountryFlag
                      countryCode={contest.country}
                      svg
                      style={{ width: '2rem', height: '1.4rem' }}
                      className="rounded-sm shadow-sm shrink-0"
                    />
                    <div>
                      <p className="text-lg font-semibold leading-none">{contest.year}</p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {contest.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-4 pb-4">
                    <div className="mb-3 h-px bg-white/10" />
                    <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Winner</p>

                    {isOverviewLoading ? (
                      <div className="mb-4 flex min-h-10 items-center gap-2">
                        <Loader2Icon className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      </div>
                    ) : winner ? (
                      <div className="mb-4 flex items-center gap-2">
                        <ReactCountryFlag
                          countryCode={winner.entry.country}
                          svg
                          style={{ width: '1.5rem', height: '1rem' }}
                          className="rounded-sm shadow-sm shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold uppercase">
                            {getCountryName(winner.entry.country)}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {winner.entry.artist} – <i>{winner.entry.song}</i>
                          </p>
                        </div>
                        <p className="ml-auto shrink-0 text-sm font-semibold text-muted-foreground">
                          {winner.totalPoints} pts
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4 flex min-h-10 items-center">
                        <p className="text-xs text-muted-foreground">No winner data</p>
                      </div>
                    )}

                    <div className="relative z-10 mt-auto flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 border border-white/20 bg-(--bg-gradient-end) text-primary-foreground hover:bg-(--bg-gradient-start)"
                      >
                        <Link to={`/year/${contest.year}/my-rank`}>Start ranking</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
