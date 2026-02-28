import { useEffect, useState } from 'react';
import { fetchYears } from '../api/years';
import type { ContestYear } from '../types/year';
import YearButton from '../components/YearButton';

const HomePage = () => {
  const [years, setYears] = useState<ContestYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await fetchYears();
        if (active) {
          setYears(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">ESCoreboard</h1>
      
      {isLoading && <p className="text-white/70">Loading years...</p>}
      {error && <p className="text-destructive font-medium">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="flex flex-col gap-3">
          {years.map((item) => (
            <YearButton key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;
