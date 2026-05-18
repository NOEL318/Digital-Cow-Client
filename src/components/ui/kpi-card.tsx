import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  /** Etiqueta corta del indicador. */
  label: string;
  /** Valor principal formateado como string. */
  value: string;
  /** Icono semantico. */
  icon?: LucideIcon;
  /** Color de acento opcional (positivo, negativo, neutro). */
  tone?: 'positive' | 'negative' | 'warning' | 'neutral';
  /** Texto secundario debajo del valor (delta, unidad). */
  hint?: string;
  className?: string;
}

const toneClasses = {
  positive: 'text-green-700',
  negative: 'text-red-700',
  warning: 'text-amber-700',
  neutral: 'text-foreground'
} as const;

/**
 * Tarjeta de indicador clave: numero grande y etiqueta breve.
 * Acepta icono y tono cromatico semantico (positivo, negativo,
 * advertencia, neutro).
 */
export function KpiCard({ label, value, icon: Icon, tone = 'neutral', hint, className }: KpiCardProps) {
  return (
    <div className={cn('rounded-xl border p-4 flex items-start justify-between gap-3', className)}>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn('text-3xl font-bold leading-tight', toneClasses[tone])}>{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {Icon ? <Icon className="h-6 w-6 text-muted-foreground" aria-hidden /> : null}
    </div>
  );
}
