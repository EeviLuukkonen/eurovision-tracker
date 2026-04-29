import { getRankingByYear } from '@/api/rankings';
import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import type { RankingByYear } from '@/types/ranking';
import { useQuery } from '@tanstack/react-query';
import { Link, matchPath, useLocation } from 'react-router-dom';

type SubNavItem = {
  label: string;
  href: string;
};

const getMatchedYear = (pathname: string): string | null => {
  const matchedPath = matchPath('/year/:year/*', pathname) ?? matchPath('/year/:year', pathname);

  return matchedPath?.params.year ?? null;
};

export const YearSubNav = () => {
  const location = useLocation();
  const currentYear = getMatchedYear(location.pathname);
  const { isAuthenticated } = useAuth();

  if (!currentYear) {
    return null;
  }

  const basePath = `/year/${currentYear}`;

  const { data: ranking = { entries: [] } } = useQuery<RankingByYear, Error>({
    queryKey: ['userRanking', currentYear],
    queryFn: () => getRankingByYear(Number(currentYear)),
    enabled: Boolean(currentYear) && isAuthenticated,
  });

  const hasSavedRanking = ranking?.entries.length > 0;
  const rankingBasePath = `${basePath}/my-rank`;
  const isOnRankingRoute =
    location.pathname === rankingBasePath || location.pathname.startsWith(`${rankingBasePath}/`);

  const items: SubNavItem[] = [
    { label: 'Overview', href: basePath },
    { label: 'Your Ranking', href: hasSavedRanking ? `${basePath}/my-rank/view` : `${basePath}/my-rank` },
    { label: 'Official Results', href: `${basePath}/official-rank` },
    { label: 'Compare', href: `${basePath}/compare` },
  ];

  return (
    <section className="border-b border-white/10 bg-background/35 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:px-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item) => {
            const isActive = item.label === 'Your Ranking'
              ? isOnRankingRoute
              : location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'h-9 shrink-0 rounded-full border border-transparent px-4 text-sm',
                  isActive
                    ? 'border-white/15 bg-white/12 text-foreground'
                    : 'text-muted-foreground hover:bg-white/8 hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};