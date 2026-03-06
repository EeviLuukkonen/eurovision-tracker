import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
        onOpenChange(false);
      } else {
        const username = formData.get('username') as string;
        await signup({ email, username, password });
        onOpenChange(false);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrorMessage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 p-0 shadow-none sm:max-w-md">
        <Card className="p-12 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {mode === 'login' ? 'Login to your account' : 'Sign up for an account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    required
                  />
                </div>

                {mode === 'register' && (
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" name="username" required />
                  </div>
                )}
                
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" name="password" required />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
                </Button>

                {errorMessage && (
                  <p className="text-center text-sm text-destructive">{errorMessage}</p>
                )}

                <div className="flex items-center justify-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto px-0"
                    onClick={handleToggleMode}
                  >
                    {mode === 'login' ? 'Sign Up' : 'Login'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

      </DialogContent>
    </Dialog>
  );
};