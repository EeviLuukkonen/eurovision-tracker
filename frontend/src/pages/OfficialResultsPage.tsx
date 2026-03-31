import { getOfficialResultsByYear } from '@/api/officialResults';
import { OfficialResultRow } from '@/components/EntryCard';
import type { OfficialResult } from '@/types/officialResult';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OfficialResultsPage = () => {
  const { year } = useParams<{ year: string }>();
  const [officialResults, setOfficialResults] = useState<OfficialResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getOfficialResultsByYear(Number(year));
        setOfficialResults(data);
      } catch (error) {
        console.error('Error fetching official results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchResults();
  }, [year]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Eurovision {year}</p>
        <h1 className="text-2xl font-semibold">Official Results</h1>
      </div>

      {!isLoading && officialResults.length === 0 && (
        <p className="text-muted-foreground text-sm">No official results available.</p>
      )}

      {!isLoading && officialResults.length > 0 && (() => {
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
