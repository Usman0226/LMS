import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-white border-gray-200',
    destructive: 'bg-red-50 border-red-200 text-red-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  const icons = {
    default: <Info className="h-4 w-4" />,
    destructive: <XCircle className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icons[variant]}</div>
        <div className="flex-1">{props.children}</div>
      </div>
    </div>
  );
});

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));

export { Alert, AlertTitle, AlertDescription };
