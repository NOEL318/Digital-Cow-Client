import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BigButton } from './big-button';

interface EmptyStateProps {
  /** Icono ilustrativo del estado vacio. */
  icon: LucideIcon;
  /** Titulo breve y amable. */
  title: string;
  /** Texto explicativo en lenguaje plano. */
  description?: string;
  /** Etiqueta del boton principal. */
  ctaLabel?: string;
  /** Handler del boton principal. */
  onCta?: () => void;
  className?: string;
}

/**
 * Estado vacio amigable con icono grande, titulo y opcionalmente
 * un boton llamada a la accion. Reemplaza los "<p>No hay datos</p>"
 * sin contexto que excluyen a usuarios con baja alfabetizacion.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCta,
  className
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center gap-4 py-12 px-4',
        className
      )}
    >
      <Icon className="h-16 w-16 text-muted-foreground" aria-hidden />
      <h2 className="text-xl font-semibold">{title}</h2>
      {description ? (
        <p className="text-base text-muted-foreground max-w-md">{description}</p>
      ) : null}
      {ctaLabel && onCta ? <BigButton label={ctaLabel} onClick={onCta} /> : null}
    </div>
  );
}
