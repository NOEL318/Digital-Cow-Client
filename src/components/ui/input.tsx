import * as React from 'react';
import { cn } from '@/lib/utils';

/** Input con estética glassmorphism, esquinas redondeadas suaves y foco con resplandor esmeralda. */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border border-white/60 dark:border-white/15 bg-white/70 dark:bg-slate-900/60 px-3.5 py-2 text-sm text-foreground shadow-sm backdrop-blur-md transition-all duration-150',
        'placeholder:text-muted-foreground/60',
        'hover:border-emerald-500/50 hover:bg-white/85 dark:hover:bg-slate-900/85 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-600 focus-visible:bg-white/95 dark:focus-visible:bg-slate-900/95 focus-visible:shadow-md',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/40',
        'file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-foreground',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';
