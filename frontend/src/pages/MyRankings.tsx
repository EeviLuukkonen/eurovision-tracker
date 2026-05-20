import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getMyRankings, deleteRankingByYear } from '@/api/rankings';
import { fetchYears } from '@/api/years';
import type { ContestYear } from '@/types/year';
import ReactCountryFlag from 'react-country-flag';
import { Loader2Icon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
interface RankingSummary {
  year: number;
  rankedCount: number;
  totalEntries: number;
  isComplete: boolean;
  updatedAt: string;
}

const MyRankingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isAuthLoading } = useAuth();
  const [yearToDelete, setYearToDelete] = useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteRankingByYear,
    onSuccess: () => {
      setYearToDelete(null);
      void queryClient.invalidateQueries({ queryKey: ['myRankings'] });
    },
  });

  const { data: response, isLoading: isRankingsLoading } = useQuery({
    queryKey: ['myRankings', user?.id ?? 'guest'],
    queryFn: getMyRankings,
    enabled: isAuthenticated && !isAuthLoading,
  });

  const rankings = isAuthenticated ? (response?.data ?? []) : [];

  const { data: years = [], isLoading: isYearsLoading } = useQuery<ContestYear[], Error>({
    queryKey: ['allYears'],
    queryFn: fetchYears,
  });

  const completed = rankings.filter((r: RankingSummary) => r.isComplete);
  const inProgress = rankings.filter((r: RankingSummary) => !r.isComplete && r.rankedCount > 0);
  const unranked = years.filter((year) => !rankings.some((r: RankingSummary) => r.year === year.year));
  const contestByYear = new Map(years.map((contest) => [contest.year, contest]));

  if (isAuthLoading || isYearsLoading || (isAuthenticated && isRankingsLoading)) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex min-h-56 items-center justify-center">
          <Loader2Icon className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Rankings</h1>
      </div>

      {!isAuthenticated && (
        <div className='mb-5'>
          <p className="text-muted-foreground">You are viewing this page as a guest. Log in to save, continue, and compare your rankings.</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-white/20 bg-background p-4 backdrop-blur">
          <div className="text-2xl font-semibold">{completed.length}</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Completed</div>
        </div>
        <div className="rounded-lg border border-white/20 bg-background p-4 backdrop-blur">
          <div className="text-2xl font-semibold">{inProgress.length}</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">In Progress</div>
        </div>
        <div className="rounded-lg border border-white/20 bg-background p-4 backdrop-blur">
          <div className="text-2xl font-semibold">{unranked.length}</div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Unranked</div>
        </div>
      </div>

      {completed.length > 0 && (
        <div className="mt-10 space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Completed</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {completed.map((ranking: RankingSummary) => (
              <div key={ranking.year} className="rounded-xl border border-white/20 bg-background/80 p-4 backdrop-blur">
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <ReactCountryFlag
                          countryCode={contestByYear.get(ranking.year)?.country ?? 'EU'}
                          svg
                          style={{ width: '1.5rem', height: '1rem' }}
                          className="rounded-sm shadow-sm"
                        />
                        <div className="font-semibold">Eurovision {ranking.year}</div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Last updated {new Date(ranking.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-emerald-100">
                      Complete
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-xs"
                      onClick={() => {
                        void navigate(`/year/${ranking.year}/my-rank/view`);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-xs"
                      onClick={() => {
                        void navigate(`/year/${ranking.year}/compare`);
                      }}
                    >
                      Compare
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300/20 text-xs text-red-100 hover:bg-red-400/10"
                      onClick={() => {
                        setYearToDelete(ranking.year);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {inProgress.length > 0 && (
        <div className="mt-10 space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">In Progress</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((ranking: RankingSummary) => {
              const progressPercent =
                ranking.totalEntries > 0
                  ? Math.min(100, (ranking.rankedCount / ranking.totalEntries) * 100)
                  : 0;
              const contest = contestByYear.get(ranking.year);

              return (
                <div key={ranking.year} className="rounded-xl border border-white/20 bg-background/80 p-3 backdrop-blur">
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <ReactCountryFlag
                            countryCode={contest?.country ?? 'EU'}
                            svg
                            style={{ width: '1.5rem', height: '1rem' }}
                            className="rounded-sm shadow-sm"
                          />
                          <div className="font-semibold">Eurovision {ranking.year}</div>
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          Last updated {new Date(ranking.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {ranking.rankedCount} / {ranking.totalEntries} ranked
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full bg-linear-to-r from-(--bg-gradient-start) to-(--bg-gradient-end)"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-xs"
                        onClick={() => {
                          void navigate(`/year/${ranking.year}/my-rank`);
                        }}
                      >
                        Continue
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300/20 text-xs text-red-100 hover:bg-red-400/10"
                        onClick={() => {
                          setYearToDelete(ranking.year);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {unranked.length > 0 && (
        <div className="mt-10 space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Unranked</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {unranked.map((contest) => (
              <div
                key={contest.year}
                className="rounded-xl border border-white/15 bg-background/80 p-4 backdrop-blur transition-colors hover:border-white/30"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-3xl font-semibold leading-none">{contest.year}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {contest.city}
                    </p>
                  </div>
                  <ReactCountryFlag
                    countryCode={contest.country}
                    svg
                    style={{ width: '2rem', height: '1.4rem' }}
                    className="rounded-sm shadow-sm"
                  />
                </div>

                <Button
                  size="sm"
                  className="w-full border border-white/20 bg-(--bg-gradient-end) text-primary-foreground hover:bg-(--bg-gradient-start)"
                  onClick={() => {
                    void navigate(`/year/${contest.year}/my-rank`);
                  }}
                >
                  Create
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Dialog open={yearToDelete !== null} onOpenChange={(open) => { if (!open) setYearToDelete(null); }}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete ranking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your Eurovision {yearToDelete} ranking? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setYearToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className="border-red-300/20 text-red-100 hover:bg-red-400/10"
              disabled={deleteMutation.isPending}
              onClick={() => { if (yearToDelete !== null) deleteMutation.mutate(yearToDelete); }}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default MyRankingsPage;
