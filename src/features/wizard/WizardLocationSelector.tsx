import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Boxes } from 'lucide-react';
import { ranchApi } from '@/features/ranches/api';
import { useAnimals } from '@/features/animals/api';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import type { AnimalListItem } from '@/features/animals/types';

interface LocationContext {
  ranchId: number | null;
  lotId: number | null;
  animal: AnimalListItem | null;
}

interface WizardLocationSelectorProps {
  /** Estado actual. */
  value: LocationContext;
  /** Callback cuando cambia el estado. El wizard externo decide cuando avanzar. */
  onChange: (next: LocationContext) => void;
  /** Si true, el animal puede ser opcional (no es obligatorio). */
  optionalAnimal?: boolean;
  /** Filtra solo animales de un sexo (ej. hembras para flujos reproductivos). */
  sexFilter?: 'FEMALE' | 'MALE';
}

/**
 * Selector jerarquico unificado para wizards: rancho -> lote -> animal.
 * Auto-selecciona cuando hay un solo elemento en un nivel. Muestra
 * chips grandes (no select) y avatar del animal. Replica la
 * estetica del wizard de ordeno: rapido, simple, visual.
 */
export function WizardLocationSelector({ value, onChange, optionalAnimal, sexFilter }: WizardLocationSelectorProps) {
  const ranches = useQuery({ queryKey: ['ranches'], queryFn: ranchApi.list });
  const lots = useQuery({
    queryKey: ['ranches', value.ranchId, 'lots'],
    queryFn: () => ranchApi.listLots(value.ranchId as number),
    enabled: !!value.ranchId
  });
  const animals = useAnimals({
    ranchId: value.ranchId ?? undefined,
    lotId: value.lotId ?? undefined,
    sex: sexFilter,
    size: 200,
    status: 'ACTIVE'
  });

  // Auto-seleccion: si solo hay UN rancho, ya viene escogido.
  useEffect(() => {
    if (value.ranchId == null && ranches.data && ranches.data.length === 1) {
      onChange({ ...value, ranchId: ranches.data[0].id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranches.data]);

  // Auto-seleccion: si el rancho elegido tiene un solo lote, ya viene escogido.
  useEffect(() => {
    if (value.ranchId != null && value.lotId == null && lots.data && lots.data.length === 1) {
      onChange({ ...value, lotId: lots.data[0].id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lots.data, value.ranchId]);

  const ranchesList = ranches.data ?? [];
  const lotsList = lots.data ?? [];
  const animalsList = animals.data?.content ?? [];

  return (
    <div className="space-y-5">
      {/* Rancho */}
      {ranchesList.length > 1 ? (
        <section className="space-y-2">
          <p className="text-sm font-semibold flex items-center gap-1">
            <MapPin className="h-4 w-4 text-primary" aria-hidden />
            Rancho
          </p>
          <ChipRow
            options={ranchesList.map(r => ({ id: r.id, label: r.name }))}
            value={value.ranchId}
            onSelect={id => onChange({ ranchId: id, lotId: null, animal: null })}
          />
        </section>
      ) : ranchesList.length === 1 && value.ranchId != null ? (
        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" aria-hidden />
          Rancho: <span className="font-semibold text-foreground">{ranchesList[0].name}</span>
        </p>
      ) : null}

      {/* Lote (solo si hay rancho elegido) */}
      {value.ranchId != null && lotsList.length > 1 ? (
        <section className="space-y-2">
          <p className="text-sm font-semibold flex items-center gap-1">
            <Boxes className="h-4 w-4 text-primary" aria-hidden />
            Lote / corral
          </p>
          <ChipRow
            options={[
              { id: null, label: 'Sin lote' },
              ...lotsList.map(l => ({ id: l.id, label: l.name }))
            ]}
            value={value.lotId}
            onSelect={id => onChange({ ...value, lotId: id, animal: null })}
          />
        </section>
      ) : value.ranchId != null && lotsList.length === 1 && value.lotId != null ? (
        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <Boxes className="h-3 w-3" aria-hidden />
          Lote: <span className="font-semibold text-foreground">{lotsList[0].name}</span>
        </p>
      ) : null}

      {/* Animal (solo cuando hay rancho elegido) */}
      {value.ranchId != null ? (
        <section className="space-y-2">
          <p className="text-sm font-semibold">
            {optionalAnimal ? 'Animal (opcional)' : 'Animal'}
          </p>
          {animalsList.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay animales activos en este {value.lotId ? 'lote' : 'rancho'}.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
              {animalsList.map(a => {
                const selected = value.animal?.id === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onChange({ ...value, animal: a })}
                    aria-pressed={selected}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-colors ${
                      selected ? 'border-primary bg-primary/10' : 'hover:bg-accent'
                    }`}
                  >
                    <AnimalAvatar
                      photoUrl={a.coverPhotoUrl ?? undefined}
                      internalTag={a.internalTag}
                      name={a.name}
                      size={40}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate text-sm">{a.internalTag}</p>
                      {a.name ? <p className="text-xs text-muted-foreground truncate">{a.name}</p> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

function ChipRow({
  options, value, onSelect
}: {
  options: Array<{ id: number | null; label: string }>;
  value: number | null;
  onSelect: (id: number | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const selected = value === o.id;
        return (
          <button
            key={o.id ?? 'null'}
            type="button"
            onClick={() => onSelect(o.id)}
            aria-pressed={selected}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              selected
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-accent border-input'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export type { LocationContext };
