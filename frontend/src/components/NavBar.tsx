import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

type NavbarProps = {
  onLoginClick?: () => void;
};

export const NavBar = ({ onLoginClick }: NavbarProps) => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full border-b border-border bg-background/70 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-8 md:px-12 py-4">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          ESCoreboard
        </Link>

        <div className="flex items-center gap-4">
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
          ) : (
            <Button variant="ghost" onClick={onLoginClick}>
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};