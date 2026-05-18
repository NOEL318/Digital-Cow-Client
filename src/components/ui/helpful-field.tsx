import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpfulFieldProps {
  /** Identificador del control interno (para asociar label e input). */
  id: string;
  /** Etiqueta visible (lenguaje plano, sin abreviaciones). */
  label: string;
  /** Texto de ayuda breve: que es y por que importa. */
  help?: string;
  /** Ejemplo concreto para campos de texto libre. */
  example?: string;
  /** Mensaje de error en lenguaje plano. */
  error?: string;
  /** Si es obligatorio (marca visual). */
  required?: boolean;
  /** Icono semantico opcional junto a la etiqueta. */
  icon?: LucideIcon;
  /** El control real (input, select, etc.). Recibe el id ya configurado. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Envoltorio accesible para un campo de formulario.
 * Garantiza: etiqueta clara, icono semantico, texto de ayuda, ejemplo,
 * mensaje de error en lenguaje plano. La lectura por voz se removio
 * porque saturaba la UI y el usuario prefirio campos limpios.
 *
 * El children debe ser el control interno (input, select, textarea) ya
 * con el id provisto. Esto evita acoplar HelpfulField a un control
 * concreto y permite reusarlo con cualquier input.
 */
export function HelpfulField({
  id,
  label,
  help,
  example,
  error,
  required,
  icon: Icon,
  children,
  className
}: HelpfulFieldProps) {
  const helpId = help || example || error ? `${id}-help` : undefined;

  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold">
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" aria-hidden /> : null}
        <span>{label}</span>
        {required ? (
          <span className="text-destructive" aria-label="obligatorio">
            *
          </span>
        ) : null}
      </label>
      {help ? (
        <p id={helpId} className="text-xs text-muted-foreground">
          {help}
        </p>
      ) : null}
      {example ? (
        <p className="text-xs text-muted-foreground">Ejemplo: {example}</p>
      ) : null}
      <div>{children}</div>
      {error ? (
        <p id={helpId} role="alert" className="text-xs text-destructive font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}
