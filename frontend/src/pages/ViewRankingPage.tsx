import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { fetchEntriesByYear } from '@/api/entries';
import { getRankingByYear } from '@/api/rankings';
import { sortAndPopulateEntries } from '@/lib/rankingHelper';
import { RankingEntryRow } from '@/components/EntryCard';
import { Button } from '@/components/ui/button';
import type { Entry } from '@/types/entry';

const ViewRankingPage = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isAuthLoading } = useAuth();

  const [rankedEntries, setRankedEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      void navigate(`/year/${year}/my-rank`);
      return;
    }

    const load = async () => {
      try {
        const [entries, ranking] = await Promise.all([
          fetchEntriesByYear(Number(year)),
          getRankingByYear(Number(year)),
        ]);
        setRankedEntries(sortAndPopulateEntries(entries, ranking.entries));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [year, isAuthenticated, isAuthLoading]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className='mb-8 flex items-start justify-between gap-4'>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Eurovision {year}</p>
          <h1 className="text-2xl font-semibold">Your Ranking</h1>
        </div>
        <Button type="button" onClick={() => void navigate(`/year/${year}/compare`)}>
          Compare with Official Results
        </Button>
      </div>

      

      {!isLoading && rankedEntries.length === 0 && (
        <p className="text-muted-foreground text-sm">No ranking saved yet.</p>
      )}

      {!isLoading && rankedEntries.length > 0 && (() => {
        return (
          <div className="min-w-0">
            <div className="mb-2 grid grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.35fr)_4.5rem] items-center gap-3 px-3 md:grid-cols-[2rem_minmax(0,1.05fr)_minmax(0,1.7fr)_4.5rem]">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Pos</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-left">Country</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-left">Artist & Song</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Points</span>
            </div>

            <ol className="min-w-0">
              {rankedEntries.map((entry, i) => (
                <RankingEntryRow key={entry.id} entry={entry} position={i + 1} />
              ))}
            </ol>
          </div>
        );
      })()}
    </main>
  );
};

export default ViewRankingPage;
