import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type NavbarProps = {
  user?: { username: string };
  onLogout?: () => void;
  onLoginClick?: () => void;
};

export const NavBar = ({ onLoginClick }: NavbarProps) => {
  return (
    <nav className="w-full border-b border-border bg-background/70 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-8 md:px-12 py-4">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-foreground">
          ESCoreboard
        </Link>
        <div>
          <Button variant="ghost" className="px-4" onClick={onLoginClick}>
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};