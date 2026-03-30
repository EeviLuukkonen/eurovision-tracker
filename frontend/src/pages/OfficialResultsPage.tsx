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
          <ol className="min-w-0">
            {officialResults.map((result) => (
              <OfficialResultRow key={result.entryId} result={result} />
            ))}
          </ol>
        );
      })()}
    </main>
  );
};

export default OfficialResultsPage;
