/**
 * Este archivo contiene el Badge reutilizable con tonos semanticos vivos.
 * Centraliza los colores (azul/verde/amarillo/rojo/rosa/grafito) para que los
 * estados y categorias se vean consistentes y con contraste en claro y oscuro.
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-muted text-muted-foreground',
        primary: 'bg-primary/10 text-primary dark:bg-primary/20',
        info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
        warning: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
        pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200',
        graphite: 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100',
        outline: 'border border-border text-foreground'
      }
    },
    defaultVariants: { tone: 'neutral' }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/** Etiqueta de estado/categoria con color por tono. */
export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { badgeVariants };
