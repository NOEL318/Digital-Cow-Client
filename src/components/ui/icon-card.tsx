import { forwardRef, type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconCardProps {
  /** Icono semantico grande de la tarjeta. */
  icon: LucideIcon;
  /** Titulo principal. */
  title: string;
  /** Texto descriptivo opcional. */
  description?: string;
  /** Slot opcional al final de la tarjeta. */
  children?: ReactNode;
  /** Tamaño visual de la tarjeta. */
  size?: 'sm' | 'md' | 'lg';
  /** Handler de click si la tarjeta es interactiva. */
  onClick?: () => void;
  /** Si es un boton, el aria-label opcional adicional. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Tarjeta visual con icono, titulo y descripcion. Base de los launchers
 * y wizards. Si recibe onClick se renderiza como boton (accesible);
 * sin onClick, como tarjeta estatica.
 */
export const IconCard = forwardRef<HTMLDivElement | HTMLButtonElement, IconCardProps>(
  (
    { icon: Icon, title, description, children, size = 'md', onClick, ariaLabel, className },
    ref
  ) => {
    const sizes = {
      sm: 'p-3 gap-2 min-h-20',
      md: 'p-5 gap-3 min-h-28',
      lg: 'p-6 gap-4 min-h-36'
    } as const;
    const iconSizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-14 w-14' } as const;
    const titleSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' } as const;

    const content = (
      <>
        <Icon className={cn(iconSizes[size], 'text-primary')} aria-hidden />
        <div className="flex flex-col items-center gap-1">
          <span className={cn(titleSizes[size], 'font-semibold')}>{title}</span>
          {description ? (
            <span className="text-xs text-muted-foreground">{description}</span>
          ) : null}
        </div>
        {children}
      </>
    );

    const baseClasses = cn(
      'flex flex-col items-center justify-center rounded-xl border bg-background text-center transition-colors',
      sizes[size],
      onClick ? 'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' : '',
      className
    );

    if (onClick) {
      return (
        <button
          type="button"
          ref={ref as React.Ref<HTMLButtonElement>}
          onClick={onClick}
          aria-label={ariaLabel}
          className={baseClasses}
        >
          {content}
        </button>
      );
    }

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={baseClasses}>
        {content}
      </div>
    );
  }
);
IconCard.displayName = 'IconCard';
