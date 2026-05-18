import { type ReactNode, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useVoice } from '@/lib/use-voice';
import { BigButton } from './big-button';
import { cn } from '@/lib/utils';

interface WizardStepProps {
  /** Numero de paso actual (1-indexed). */
  current: number;
  /** Total de pasos. */
  total: number;
  /** Titulo grande del paso (una sola pregunta clara). */
  title: string;
  /** Subtitulo o texto de ayuda corto. */
  subtitle?: string;
  /** Contenido del paso (form fields, BigPickers, etc.). */
  children: ReactNode;
  /** Etiqueta del boton siguiente; default "Siguiente". */
  nextLabel?: string;
  /** Etiqueta del boton atras; default "Volver". */
  backLabel?: string;
  /** Si el paso es valido y se puede avanzar. */
  canAdvance: boolean;
  /** Handler para avanzar al siguiente paso. */
  onNext: () => void;
  /** Handler para volver al paso anterior. Si no se provee, no se muestra. */
  onBack?: () => void;
  /** Si es el ultimo paso, cambia el boton siguiente a "Guardar". */
  isLast?: boolean;
  className?: string;
}

/**
 * Un paso de wizard accesible. Anuncia el titulo en voz alta al
 * montarse si el usuario tiene activada la preferencia de voz.
 * Muestra el progreso "Paso N de M" y dos botones grandes Atras y
 * Siguiente / Guardar.
 */
export function WizardStep({
  current,
  total,
  title,
  subtitle,
  children,
  nextLabel,
  backLabel,
  canAdvance,
  onNext,
  onBack,
  isLast,
  className
}: WizardStepProps) {
  const { speak } = useVoice();
  const titleRef = useRef(title);

  useEffect(() => {
    if (titleRef.current === title) {
      speak(title);
    } else {
      titleRef.current = title;
      speak(title);
    }
  }, [title, speak]);

  return (
    <div className={cn('flex flex-col gap-6 max-w-2xl mx-auto', className)}>
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Paso {current} de {total}
        </p>
        <h1 className="text-2xl font-bold leading-tight">{title}</h1>
        {subtitle ? <p className="text-base text-muted-foreground">{subtitle}</p> : null}
      </header>
      <section className="space-y-4">{children}</section>
      <footer className="flex items-center justify-between gap-3 pt-4">
        {onBack ? (
          <BigButton
            label={backLabel ?? 'Volver'}
            icon={ChevronLeft}
            variant="outline"
            onClick={onBack}
          />
        ) : (
          <span />
        )}
        <BigButton
          label={nextLabel ?? (isLast ? 'Guardar' : 'Siguiente')}
          icon={isLast ? Check : ChevronRight}
          variant="primary"
          disabled={!canAdvance}
          onClick={onNext}
        />
      </footer>
    </div>
  );
}
