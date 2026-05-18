import { useState, useMemo } from 'react';
import { useAnimals } from '@/features/animals/api';
import type { AnimalListItem } from '@/features/animals/types';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AnimalPickerStepProps {
  /** Animal seleccionado actualmente. */
  value: AnimalListItem | null;
  /** Callback al seleccionar. */
  onChange: (animal: AnimalListItem) => void;
}

/**
 * Buscador con resultados visuales para elegir un animal dentro de un
 * wizard. Muestra foto, marca y nombre. Limita a 20 resultados visibles.
 */
export function AnimalPickerStep({ value, onChange }: AnimalPickerStepProps) {
  const [q, setQ] = useState('');
  const filters = useMemo(() => ({ search: q || undefined, size: 20 }), [q]);
  const animals = useAnimals(filters);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
        <Input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Marca o nombre del animal"
          className="pl-9"
          autoFocus
        />
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        {(animals.data?.content ?? []).map(a => {
          const selected = value?.id === a.id;
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => onChange(a)}
                aria-pressed={selected}
                className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  selected ? 'border-primary bg-primary/10' : 'hover:bg-accent'
                }`}
              >
                <AnimalAvatar
                  photoUrl={a.coverPhotoUrl ?? undefined}
                  internalTag={a.internalTag}
                  name={a.name}
                  size={48}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{a.internalTag}</p>
                  {a.name ? <p className="text-sm text-muted-foreground truncate">{a.name}</p> : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
