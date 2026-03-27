import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { fetchEntriesByYear } from '@/api/entries';
import { getRankingByYear } from '@/api/rankings';
import { sortEntriesByRanking } from '@/lib/rankingHelper';
import { RankingEntryRow } from '@/components/EntryCard';
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
        setRankedEntries(sortEntriesByRanking(entries, ranking.entries));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [year, isAuthenticated, isAuthLoading]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className='mb-8'>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Eurovision {year}</p>
        <h1 className="text-2xl font-semibold">Your Ranking</h1>
      </div>

      {!isLoading && rankedEntries.length === 0 && (
        <p className="text-muted-foreground text-sm">No ranking saved yet.</p>
      )}

      {!isLoading && rankedEntries.length > 0 && (() => {
        const half = Math.ceil(rankedEntries.length / 2);
        const left = rankedEntries.slice(0, half);
        const right = rankedEntries.slice(half);

        return (
          <div className="flex gap-4">
            <ol className="flex-1 min-w-0">
              {left.map((entry, i) => (
                <RankingEntryRow key={entry.id} entry={entry} position={i + 1} />
              ))}
            </ol>
            <ol className="flex-1 min-w-0">
              {right.map((entry, i) => (
                <RankingEntryRow key={entry.id} entry={entry} position={half + i + 1} />
              ))}
            </ol>
          </div>
        );
      })()}
    </main>
  );
};

export default ViewRankingPage;
