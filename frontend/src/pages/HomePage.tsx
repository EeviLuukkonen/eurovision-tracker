import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { fetchYears } from '../api/years';
import type { ContestYear } from '../types/year';
import YearButton from '../components/YearButton';
import { ErrorAlert } from '@/components/ErrorAlert';

const HomePage = () => {
  const {
    data: years = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ContestYear[], Error>({
    queryKey: ['years'],
    queryFn: fetchYears,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">ESCoreboard</h1>
      </div>
      
      {isLoading && (
        <div className="flex min-h-56 items-center justify-center">
          <Loader2Icon className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      )}
      {error && <ErrorAlert error={error} title="Could not load years" onRetry={() => void refetch()} />}

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
