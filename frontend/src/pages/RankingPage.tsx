import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEntriesByYear } from '../api/entries';
import type { Entry } from '../types/entry';
import ReactCountryFlag from 'react-country-flag';
import { ArrowLeft } from 'lucide-react';

const YearPage = () => {
  const { year } = useParams<{ year: string }>();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!year) return;

    let active = true;

    const load = async () => {
      try {
        const data = await fetchEntriesByYear(Number(year));
        if (active) {
          setEntries(data);
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
  }, [year]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 mb-6 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        Back to years
      </Link>

      <h1 className="text-4xl font-bold mb-8">Eurovision {year}</h1>

      {isLoading && <p className="text-white/70">Loading entries...</p>}
      {error && <p className="text-destructive font-medium">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="w-full p-4 flex items-center gap-4 border-2 border-white/20 rounded-lg bg-white/5"
            >
              <div className="flex-shrink-0 opacity-75">
                <ReactCountryFlag
                  countryCode={entry.country}
                  svg
                  style={{ width: '3rem', height: '2.25rem' }}
                  className="rounded shadow-sm"
                />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-white">{entry.artist}</div>
                <div className="text-white/70">{entry.song}</div>
              </div>
              {entry.youtubeUrl && (
                <a
                  href={entry.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-white transition-colors"
                >
                  Watch
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default YearPage;
