/**
 * Esta pagina lista los ordenos individuales registrados y permite agregar nuevos.
 */
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Milk, Sun, Moon } from 'lucide-react';
import { useMilkings } from '@/features/production/milkings/api';
import { animalsApi } from '@/features/animals/api';
import type { Milking } from '@/features/production/milkings/types';
import type { AnimalListItem } from '@/features/animals/types';
import { BigButton } from '@/components/ui/big-button';
import { EmptyState } from '@/components/ui/empty-state';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { Badge } from '@/components/ui/badge';

/**
 * Listado simple de ordeños. La captura se hace via wizard
 * /hacer-nota/ordene; aqui solo se ven los ultimos registros con
 * foto del animal, fecha y litros.
 */
export default function MilkingsPage() {
  const { t } = useTranslation(['production', 'common']);
  const milkings = useMilkings();
  const animals = useQuery({
    queryKey: ['animals', { size: 999 }],
    queryFn: () => animalsApi.list({ size: 999 })
  });

  const animalsById = new Map<number, AnimalListItem>();
  for (const a of animals.data?.content ?? []) animalsById.set(a.id, a);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Milk className="h-6 w-6 text-primary" aria-hidden />
          {t('production:milking.title')}
        </h1>
        <BigButton
          label={t('production:milking.new')}
          icon={Plus}
          onClick={() => window.location.assign('/hacer-nota/ordene')}
        />
      </header>

      {milkings.isLoading ? (
        <p className="text-muted-foreground">{t('common:loading')}</p>
      ) : !milkings.data || milkings.data.length === 0 ? (
        <EmptyState
          icon={Milk}
          title={t('production:tab.empty')}
          description={t('production:milking.noActiveAnimals')}
          ctaLabel={t('production:milking.new')}
          onCta={() => window.location.assign('/hacer-nota/ordene')}
        />
      ) : (
        <ul className="divide-y border rounded-xl overflow-hidden">
          {milkings.data.map(m => (
            <MilkingRow key={m.id} milking={m} animal={animalsById.get(m.animalId)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MilkingRow({ milking, animal }: { milking: Milking; animal?: AnimalListItem }) {
  const { t } = useTranslation('production');
  const SessionIcon = milking.session === 'AM' ? Sun : milking.session === 'PM' ? Moon : Milk;
  const sessionLabel =
    milking.session === 'AM'
      ? t('milkingRow.morning')
      : milking.session === 'PM'
      ? t('milkingRow.afternoon')
      : t('milkingRow.day');

  const sessionTone =
    milking.session === 'AM' ? 'warning' : milking.session === 'PM' ? 'info' : 'neutral';

  return (
    <li>
      <Link
        to={animal ? `/animales/${animal.id}` : '#'}
        className="flex items-center gap-3 px-3 py-3 hover:bg-accent transition-colors"
      >
        {animal ? (
          <AnimalAvatar
            photoUrl={animal.coverPhotoUrl ?? undefined}
            internalTag={animal.internalTag}
            name={animal.name}
            size={48}
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Milk className="h-5 w-5 text-muted-foreground" aria-hidden />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">
            {animal?.internalTag ?? `Animal ${milking.animalId}`}
            {animal?.name ? <span className="text-muted-foreground"> · {animal.name}</span> : null}
          </p>
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <SessionIcon className="h-3 w-3" aria-hidden />
            <Badge tone={sessionTone}>{sessionLabel}</Badge>
            <span>{milking.milkingDate}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-green-700 dark:text-green-400">
            {milking.liters}
          </span>
          <span className="text-xs text-muted-foreground font-normal ml-1">
            {t('milkingRow.liters')}
          </span>
        </div>
      </Link>
    </li>
  );
}
