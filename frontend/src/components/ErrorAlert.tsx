import { Button } from '@/components/ui/button';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';
import { getErrorMessage } from '../lib/errorMessages';

type ErrorAlertProps = {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
};

export const ErrorAlert = ({ error, onRetry, title = 'Could not load data' }: ErrorAlertProps) => {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-xl border border-destructive bg-destructive/60 px-4 py-3">
      <div className="flex items-start gap-3">
        <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-2 text-sm text-foreground/80">{getErrorMessage(error)}</p>
          {onRetry && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 border-destructive/40 hover:bg-destructive"
              onClick={onRetry}
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
