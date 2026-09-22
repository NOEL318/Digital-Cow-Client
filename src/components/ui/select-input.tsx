import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

/** Control Select con estética glassmorphism coordinado con Input y Button. */
export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ className, children, ...props }, ref) => (
    <select
      className={cn(
        'flex h-11 w-full rounded-xl border border-white/60 dark:border-white/15 bg-white/70 dark:bg-slate-900/60 px-3.5 py-2 text-sm text-foreground shadow-sm backdrop-blur-md transition-all duration-150',
        'hover:border-emerald-500/50 hover:bg-white/85 dark:hover:bg-slate-900/85 hover:shadow-md',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 focus:bg-white/95 dark:focus:bg-slate-900/95 focus:shadow-md',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/40',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
);
SelectInput.displayName = 'SelectInput';
