import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BigPickerOption<T extends string | number> {
  /** Valor logico que se devuelve al seleccionar. */
  value: T;
  /** Etiqueta visible y leida (sin abreviaciones). */
  label: string;
  /** Icono semantico opcional. */
  icon?: LucideIcon;
  /** Subtitulo breve opcional. */
  description?: string;
}

interface BigPickerProps<T extends string | number> {
  /** Opciones a mostrar como tarjetas seleccionables. */
  options: ReadonlyArray<BigPickerOption<T>>;
  /** Valor actualmente seleccionado. */
  value?: T | null;
  /** Callback al seleccionar. */
  onChange: (value: T) => void;
  /** Etiqueta accesible del grupo (radiogroup). */
  ariaLabel: string;
  className?: string;
}

/**
 * Selector tipo grid de tarjetas grandes. Reemplaza al select para
 * opciones cortas (sexo, proposito, motivo). Cumple roles radiogroup y
 * radio con navegacion por teclado nativa.
 */
export function BigPicker<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  className
}: BigPickerProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('grid grid-cols-2 sm:grid-cols-3 gap-2', className)}
    >
      {options.map(opt => {
        const Icon = opt.icon;
        const selected = value === opt.value;
        return (
          <button
            type="button"
            key={String(opt.value)}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-xl border p-4 min-h-24 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected
                ? 'border-primary bg-primary/10'
                : 'border-input hover:bg-accent'
            )}
          >
            {Icon ? <Icon className="h-8 w-8 text-primary" aria-hidden /> : null}
            <span className="text-base font-semibold">{opt.label}</span>
            {opt.description ? (
              <span className="text-xs text-muted-foreground">{opt.description}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
