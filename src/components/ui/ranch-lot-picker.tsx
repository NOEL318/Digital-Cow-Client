import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Map as MapIcon, MapPin } from 'lucide-react';
import { ranchApi } from '@/features/ranches/api';
import type { Ranch, Lot } from '@/features/ranches/types';

interface RanchPickerProps {
  /** Rancho seleccionado. */
  value: number | null | undefined;
  /** Callback al elegir. */
  onChange: (id: number | null) => void;
  /** Permite mostrar "todos" como opcion explicita. */
  allowAll?: boolean;
}

/**
 * Selector visual de ranchos en forma de chips grandes. Reemplaza
 * al select tradicional con tarjetas tocables (icono + nombre) que
 * el ranchero ve y elige sin tener que desplegar listas.
 */
export function RanchPicker({ value, onChange, allowAll }: RanchPickerProps) {
  const { t } = useTranslation('common');
  const ranches = useQuery({ queryKey: ['ranches'], queryFn: ranchApi.list });
  const items = ranches.data ?? [];

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('ranchPicker.noRanches')}</p>;
  }

  return (
    <div role="radiogroup" aria-label={t('ranchPicker.ariaLabel')} className="flex flex-wrap gap-2">
      {allowAll ? (
        <Chip selected={value == null} onClick={() => onChange(null)} label={t('ranchPicker.allLabel')} icon={MapIcon} />
      ) : null}
      {items.map(r => (
        <Chip
          key={r.id}
          selected={value === r.id}
          onClick={() => onChange(r.id)}
          label={r.name}
          icon={MapPin}
        />
      ))}
    </div>
  );
}

interface LotPickerProps {
  ranchId: number | null | undefined;
  value: number | null | undefined;
  onChange: (id: number | null) => void;
  allowAll?: boolean;
}

/**
 * Selector visual de lotes. Se filtra automaticamente por el
 * ranchId que se le pasa. Si no hay rancho elegido, muestra ayuda.
 */
export function LotPicker({ ranchId, value, onChange, allowAll }: LotPickerProps) {
  const { t } = useTranslation('common');
  const lots = useQuery({
    queryKey: ['ranches', ranchId, 'lots'],
    queryFn: () => ranchApi.listLots(ranchId as number),
    enabled: !!ranchId
  });
  const items = lots.data ?? [];

  if (!ranchId) {
    return <p className="text-sm text-muted-foreground">{t('lotPicker.pickRanchFirst')}</p>;
  }
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('lotPicker.noLots')}</p>;
  }

  return (
    <div role="radiogroup" aria-label={t('lotPicker.ariaLabel')} className="flex flex-wrap gap-2">
      {allowAll ? (
        <Chip selected={value == null} onClick={() => onChange(null)} label={t('lotPicker.allLabel')} icon={MapIcon} />
      ) : null}
      {items.map(l => (
        <Chip
          key={l.id}
          selected={value === l.id}
          onClick={() => onChange(l.id)}
          label={l.name}
          icon={MapIcon}
        />
      ))}
    </div>
  );
}

function Chip({
  selected, onClick, label, icon: Icon
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  icon: typeof MapIcon;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
        selected
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background hover:bg-accent border-input'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}

/** Util: si solo hay un rancho o lote disponible, devuelve su id (para auto-seleccion). */
export function useAutoPickFirst<T extends { id: number }>(items: T[] | undefined): number | null {
  return useMemo(() => (items && items.length === 1 ? items[0].id : null), [items]);
}

export type { Ranch, Lot };
