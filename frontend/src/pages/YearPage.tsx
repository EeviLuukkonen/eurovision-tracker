import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchYearOverview } from '@/api/years';
import { getCountryName } from '@/lib/countries';
import ReactCountryFlag from 'react-country-flag';
import { BarChart3Icon, ChevronRightIcon, Loader2Icon, PencilLineIcon } from 'lucide-react';
import { ErrorAlert } from '@/components/ErrorAlert';

const YearPage = () => {
  const { year } = useParams<{ year: string }>();

  const {
    data: overview,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['yearOverview', year],
    queryFn: () => fetchYearOverview(Number(year)),
  });

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex min-h-56 items-center justify-center">
          <Loader2Icon className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (error || !overview) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <ErrorAlert error={error} title="Could not load contest overview" />
      </main>
    );
  }

  const winner = overview.winner;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Contest overview</p>
            <h1 className="text-3xl uppercase font-semibold mb-2 flex items-center gap-3">
              <ReactCountryFlag
                countryCode={overview.contest.country}
                svg
                style={{ width: '2.25rem', height: '1.5rem' }}
                className="rounded-sm shadow-sm shrink-0"
              />
              <span>{overview.contest.city} {year}</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="space-y-6">
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">TOP 3 LEADERBOARD</p>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-3">
              {overview.top3.slice(0, 3).map((entry, idx) => (
                <div
                  key={entry.entryId}
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-background px-4 py-3"
                >
                  <span className="w-6 shrink-0 text-center text-sm font-semibold text-muted-foreground">{idx + 1}</span>

                  <ReactCountryFlag
                    countryCode={entry.entry.country}
                    svg
                    style={{ width: '2rem', height: '1.4rem' }}
                    className="rounded-sm shadow-sm shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold uppercase">{getCountryName(entry.entry.country)}</p>
                    <p className="truncate text-xs tracking-wide text-muted-foreground">
                      {entry.entry.artist} - <i>{entry.entry.song}</i>
                    </p>
                  </div>

                  <p className="shrink-0 text-2xl font-semibold text-foreground">{entry.totalPoints} <span className="text-lg">pts</span></p>
                </div>
              ))}
            </div>
          </section>

          {(overview.juryWinner || overview.televoteWinner) && (
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">VOTING WINNERS</p>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {overview.televoteWinner && (
                  <div className="rounded-xl border border-white/20 bg-background p-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Televote Winner</p>
                    <div className="mt-3 flex items-center gap-3">
                      <ReactCountryFlag
                        countryCode={overview.televoteWinner.entry.country}
                        svg
                        style={{ width: '2rem', height: '1.4rem' }}
                        className="rounded-sm shadow-sm shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold uppercase">{getCountryName(overview.televoteWinner.entry.country)}</p>
                        <p className="truncate text-xs tracking-wide text-muted-foreground">
                          {overview.televoteWinner.entry.artist} - <i>{overview.televoteWinner.entry.song}</i>
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-lg font-semibold">{overview.televoteWinner.televotePoints} pts</p>
                  </div>
                )}
                {overview.juryWinner && (
                  <div className="rounded-xl border border-white/20 bg-background p-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Jury Winner</p>
                    <div className="mt-3 flex items-center gap-3">
                      <ReactCountryFlag
                        countryCode={overview.juryWinner.entry.country}
                        svg
                        style={{ width: '2rem', height: '1.4rem' }}
                        className="rounded-sm shadow-sm shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold uppercase">{getCountryName(overview.juryWinner.entry.country)}</p>
                        <p className="truncate text-xs tracking-wide text-muted-foreground">
                          {overview.juryWinner.entry.artist} - <i>{overview.juryWinner.entry.song}</i>
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-lg font-semibold">{overview.juryWinner.juryPoints} pts</p>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">CONTEST DETAILS</p>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="rounded-xl border border-white/20 bg-background p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Venue</p>
                  <p className="mt-1 text-base font-semibold">{overview.contest.arena}, {getCountryName(overview.contest.country)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Contestants</p>
                  <p className="mt-1 text-base font-semibold">{overview.contestantsCount} countries</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Slogan</p>
                  <p className="mt-1 text-base font-semibold">{overview.contest.slogan}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">WINNER VIDEO</p>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            {winner?.entry.youtubeUrl ? (
              <div className="aspect-video overflow-hidden rounded-lg bg-black">
                <iframe
                  src={winner.entry.youtubeUrl}
                  title={`${winner.entry.artist} - ${winner.entry.song}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg border border-white/20 bg-background flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No winner video available</p>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <Button asChild size="lg" className="h-25 w-full rounded-xl whitespace-normal border border-white/20 bg-(--bg-gradient-end) px-5 py-2.5 hover:bg-(--bg-gradient-start)">
              <Link to={`/year/${year}/my-rank`} className="flex w-full items-center gap-3 text-left leading-tight">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10">
                  <PencilLineIcon className="h-5 w-5 text-primary-foreground/90" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold">Create My Ranking</span>
                  <span className="mt-1 block whitespace-normal wrap-break-word text-xs font-normal leading-snug text-primary-foreground/60">Build your personal top list and compare your picks with the final outcome.</span>
                </span>
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-primary-foreground/70" />
              </Link>
            </Button>

            <Button asChild size="lg" className="h-25 w-full rounded-xl whitespace-normal border border-white/20 bg-(--bg-gradient-end) px-5 py-2.5 hover:bg-(--bg-gradient-start)">
              <Link to={`/year/${year}/official-rank`} className="flex w-full items-center gap-3 text-left leading-tight">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10">
                  <BarChart3Icon className="h-5 w-5 text-primary-foreground/90" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold">View Official Results</span>
                  <span className="mt-1 block whitespace-normal wrap-break-word text-xs font-normal leading-snug text-primary-foreground/60">Open the complete official scoreboard with points and placement details.</span>
                </span>
                <ChevronRightIcon className="h-5 w-5 shrink-0 text-primary-foreground/70" />
              </Link>
            </Button>
          </section>

        </div>
      </div>
    </main>
  );
};

export default YearPage;