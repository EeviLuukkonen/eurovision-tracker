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
    <main style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>ESCoreboard</h1>
      
      {isLoading && <p>Loading years...</p>}
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}

      {!isLoading && !error && (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {years.map((item) => (
            <YearButton key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;
