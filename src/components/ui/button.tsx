import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:shadow-md hover:from-emerald-700 hover:to-teal-700 border border-white/20',
        destructive: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-sm hover:shadow-md hover:from-rose-700 hover:to-red-700 border border-white/20',
        outline: 'border border-white/60 dark:border-white/15 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md hover:bg-white/90 dark:hover:bg-slate-800/80 hover:border-emerald-500/40 text-foreground shadow-sm hover:shadow-md',
        ghost: 'hover:bg-white/50 dark:hover:bg-white/10 hover:text-foreground'
      },
      size: { default: 'h-11 px-5 py-2.5', sm: 'h-9 px-3 text-xs', lg: 'h-12 px-8 text-base', icon: 'h-11 w-11' }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/** Boton estilo shadcn con variantes. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';
