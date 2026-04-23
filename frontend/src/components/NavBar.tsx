import { fetchYears } from '@/api/years';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import type { ContestYear } from '@/types/year';
import { useQuery } from '@tanstack/react-query';
import { ChevronDownIcon } from 'lucide-react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type NavbarProps = {
  onLoginClick?: () => void;
};

export const NavBar = ({ onLoginClick }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthLoading } = useAuth();

  const { data: years = [] } = useQuery<ContestYear[], Error>({
    queryKey: ['years'],
    queryFn: fetchYears,
    staleTime: 1000 * 60 * 5,
  });

  const matchedPath = matchPath('/year/:year/*', location.pathname) ?? matchPath('/year/:year', location.pathname);
  const currentYear = matchedPath?.params.year ?? null;

  const handleYearNavigation = (nextYear: number) => {
    if (!currentYear) {
      void navigate(`/year/${nextYear}`);
      return;
    }

    const currentPrefix = `/year/${currentYear}`;
    const targetPrefix = `/year/${nextYear}`;
    const suffix = location.pathname.startsWith(currentPrefix)
      ? location.pathname.slice(currentPrefix.length)
      : '';

    void navigate(`${targetPrefix}${suffix}`);
  };

  const navButtonClassName = (active = false) => cn(
    'h-9 rounded-full border px-4 text-xs font-semibold tracking-widest uppercase',
    active
      ? 'border-white/15 bg-white/12 text-foreground hover:bg-white/16'
      : 'border-transparent text-muted-foreground hover:bg-white/8 hover:text-foreground'
  );

  return (
    <nav className="w-full border-b border-border bg-background/70 backdrop-blur-md sticky top-0 z-50">
      <div className="px-8 py-3">
        <div className="flex items-center gap-3 px-8">
          <Link
            to="/"
            className="shrink-0 text-2xl font-semibold tracking-tight text-foreground"
          >
            ESCoreboard
          </Link>

          <div className="ml-auto flex items-center gap-5">
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" className={navButtonClassName(Boolean(currentYear))}>
                    <span>{currentYear ? `Contests · ${currentYear}` : 'Contests'}</span>
                    <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-56 border-white/15 bg-background/95 text-foreground backdrop-blur-md"
                >
                  <DropdownMenuLabel>Select a contest year</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {years.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      className={cn(
                        'cursor-pointer justify-between gap-3',
                        String(item.year) === currentYear && 'bg-white/10 text-foreground'
                      )}
                      onSelect={() => handleYearNavigation(item.year)}
                    >
                      <span>{item.year}</span>
                      <span className="text-xs text-muted-foreground">{item.city}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button type="button" variant="ghost" size="sm" className={navButtonClassName()} onClick={() => console.log('TODO MY RANKINGS')}>
                <span>My Rankings</span>
              </Button>
            </div>

            <div className="flex h-9 min-w-24 items-center justify-end">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-9 cursor-pointer items-center justify-center px-4 focus-visible:outline-none focus-visible:ring-0"
                    >
                      <Avatar size="lg" className="border border-border">
                        <AvatarFallback className="bg-muted text-foreground">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 border-border bg-background text-card-foreground"
                  >
                    <DropdownMenuLabel className="text-muted-foreground">
                      Logged in as 
                      <span className="font-medium text-foreground"> {user.username}</span>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                      onClick={() => void logout()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : isAuthLoading ? (
                <div aria-hidden className="h-9 w-18" />
              ) : (
                <Button variant="ghost" className="px-4" onClick={onLoginClick}>
                  Login
                </Button>
              )}
            </div>
          </div>
      </div>
      </div>
    </nav>
  );
};