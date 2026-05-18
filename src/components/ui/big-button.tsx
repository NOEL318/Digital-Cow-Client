import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto principal visible y leido por lectores de pantalla. */
  label: string;
  /** Icono semantico junto al texto. */
  icon?: LucideIcon;
  /** Variante visual: primaria, contorno o destructiva. */
  variant?: 'primary' | 'outline' | 'destructive';
}

/**
 * Boton grande, accesible: altura minima 56 pixels, area tactil amplia,
 * label obligatorio (no admite contenido solo icono). Pensado para
 * acciones principales de un wizard o pantalla.
 */
export const BigButton = React.forwardRef<HTMLButtonElement, BigButtonProps>(
  ({ label, icon: Icon, variant = 'primary', className, ...rest }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-xl text-base font-semibold min-h-14 px-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none';
    const variants: Record<NonNullable<BigButtonProps['variant']>, string> = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], className)} {...rest}>
        {Icon ? <Icon className="h-5 w-5" aria-hidden /> : null}
        <span>{label}</span>
      </button>
    );
  }
);
BigButton.displayName = 'BigButton';
