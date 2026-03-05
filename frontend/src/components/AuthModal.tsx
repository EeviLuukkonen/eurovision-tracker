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

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 p-0 shadow-none sm:max-w-md">
        <Card className="p-12 shadow-none">
          <CardHeader>
            <CardTitle className="text-xl text-center">Login to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>

                <div className="flex items-center justify-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Don't have an account?
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto px-0"
                  >
                    Sign Up
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