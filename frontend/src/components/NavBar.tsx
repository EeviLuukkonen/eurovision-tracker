import { useState } from 'react';
import { fetchYears } from '@/api/years';
import { deleteAccount } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import type { ContestYear } from '@/types/year';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteAccountMutation = useMutation<void, Error>({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      setDeleteDialogOpen(false);
      await logout();
      void navigate('/');
    },
  });

  const { data: years = [] } = useQuery<ContestYear[], Error>({
    queryKey: ['years'],
    queryFn: fetchYears,
    staleTime: 1000 * 60 * 5,
  });

  const matchedPath = matchPath('/year/:year/*', location.pathname) ?? matchPath('/year/:year', location.pathname);
  const currentYear = matchedPath?.params.year ?? null;

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
              <Button type="button" variant="ghost" size="sm" className={navButtonClassName()} onClick={() => void navigate('/')}>
                <span>Home</span>
              </Button>
              
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
                      onSelect={() => void navigate(`/year/${item.year}`)}
                    >
                      <span>{item.year}</span>
                      <span className="text-xs text-muted-foreground">{item.city}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button type="button" variant="ghost" size="sm" className={navButtonClassName()} onClick={() => void navigate('/my-rankings')}>
                <span>My Rankings</span>
              </Button>
            </div>

            <div className="flex h-9 min-w-24 items-center justify-end">
              {user ? (
                <>
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

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="cursor-pointer text-red-100 focus:bg-red-400/10 focus:text-red-100"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete my account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) setDeleteDialogOpen(false); }}>
                  <DialogContent showCloseButton={false}>
                    <DialogHeader>
                      <DialogTitle>Delete account</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete your account? All your rankings will be permanently removed and this cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-300/20 text-red-100 hover:bg-red-400/10"
                        disabled={deleteAccountMutation.isPending}
                        onClick={() => deleteAccountMutation.mutate()}
                      >
                        {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete my account'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                </>
              ) : isAuthLoading ? (
                <div aria-hidden className="h-9 w-18" />
              ) : (
                <Button variant="ghost" className={navButtonClassName()} onClick={onLoginClick}>
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