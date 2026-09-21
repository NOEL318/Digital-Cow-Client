import * as React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-white/60 dark:border-white/10 bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40 backdrop-blur-xl text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-150',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
  <div className={cn('flex flex-col space-y-1.5 p-5 md:p-6', className)} {...props} />;

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) =>
  <h3 className={cn('text-base md:text-lg font-bold leading-tight tracking-tight', className)} {...props} />;

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
  <div className={cn('p-5 md:p-6 pt-0', className)} {...props} />;
