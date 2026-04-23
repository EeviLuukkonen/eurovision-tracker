import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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

  if (!currentYear) {
    return null;
  }

  const basePath = `/year/${currentYear}`;

  const items: SubNavItem[] = [
    { label: 'Overview', href: basePath },
    { label: 'Rank Entries', href: `${basePath}/my-rank` },
    { label: 'My Ranking', href: `${basePath}/my-rank/view` },
    { label: 'Official Results', href: `${basePath}/official-rank` },
    { label: 'Compare', href: `${basePath}/compare` },
  ];

  return (
    <section className="border-b border-white/10 bg-background/35 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:px-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item) => {
            const isActive = location.pathname === item.href;

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