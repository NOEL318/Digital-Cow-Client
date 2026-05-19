/**
 * Esta pagina lista todos los animales del rancho con filtros, busqueda y acciones rapidas.
 */
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeferredValue, useMemo, useState } from 'react';
import {
  LayoutGrid, List, Map as MapIcon, Plus, Search, MapPin,
  Syringe, Pill, Scale, Heart, Baby, Milk, type LucideIcon
} from 'lucide-react';
import { animalsApi } from '@/features/animals/api';
import { breedsApi } from '@/features/breeds/api';
import { ranchApi } from '@/features/ranches/api';
import type { AnimalListItem } from '@/features/animals/types';
import { useAnimalBadges, type AnimalBadge } from '@/features/animals/badges/api';
import { Input } from '@/components/ui/input';
import { BigButton } from '@/components/ui/big-button';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { RanchMap } from '@/components/ranch-map';

type ViewMode = 'list' | 'cards' | 'map';

const BADGE_META: Record<string, { icon: LucideIcon; color: string; label: string; short: string }> = {
  VACCINE_DUE:    { icon: Syringe, color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',       label: 'Vacuna atrasada',     short: 'Vacuna' },
  TREATMENT_OPEN: { icon: Pill,    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200', label: 'En tratamiento',  short: 'Tratamiento' },
  WEIGHING_DUE:   { icon: Scale,   color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200', label: 'Falta pesar',         short: 'Pesar' },
  IN_HEAT:        { icon: Heart,   color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200',     label: 'En celo',             short: 'Celo' },
  PREGNANT:       { icon: Baby,    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200', label: 'Preñada',         short: 'Preñada' },
  DRY:            { icon: Milk,    color: 'bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-100',    label: 'Seca',                short: 'Seca' }
};

/** Listado de animales con foto principal, badges de estado, búsqueda y tres modos visuales. */
export default function AnimalsListPage() {
  const { t } = useTranslation('animals');
  const { t: tc } = useTranslation('common');
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page') ?? 0);
  const [searchInput, setSearchInput] = useState(params.get('search') ?? '');
  const search = useDeferredValue(searchInput);
  const [mode, setMode] = useState<ViewMode>(() =>
    (window.localStorage.getItem('animals.viewMode') as ViewMode | null) ?? 'list'
  );

  function setView(v: ViewMode) {
    setMode(v);
    window.localStorage.setItem('animals.viewMode', v);
  }

  const filters = {
    page,
    size: 24,
    search: search || undefined,
    ranchId: params.get('ranchId') ? Number(params.get('ranchId')) : undefined,
    breedId: params.get('breedId') ? Number(params.get('breedId')) : undefined,
    status: params.get('status') ?? undefined,
    sex: (params.get('sex') as 'FEMALE' | 'MALE' | null) ?? undefined,
    purpose: (params.get('purpose') as 'BEEF' | 'DAIRY' | 'DUAL' | null) ?? undefined
  };

  const list = useQuery({
    queryKey: ['animals', filters],
    queryFn: () => animalsApi.list(filters),
    placeholderData: prev => prev
  });
  const breeds = useQuery({ queryKey: ['breeds'], queryFn: breedsApi.list });
  const ranches = useQuery({ queryKey: ['ranches'], queryFn: ranchApi.list });
  const badges = useAnimalBadges();

  const badgesByAnimal = useMemo(() => {
    const m = new Map<number, AnimalBadge[]>();
    for (const b of badges.data ?? []) m.set(b.animalId, b.badges);
    return m;
  }, [badges.data]);

  const setParam = (k: string, v: string | undefined) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v); else p.delete(k);
    p.set('page', '0');
    setParams(p);
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <BigButton label={t('new')} icon={Plus} variant="primary" onClick={() => window.location.assign('/animales/nuevo')} />
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
          <Input
            placeholder={t('filters.search')}
            value={searchInput}
            onChange={e => { setSearchInput(e.target.value); setParam('search', e.target.value); }}
            className="pl-9"
          />
        </div>
        <select
          className="border rounded px-2 py-2 bg-background text-base"
          value={params.get('ranchId') ?? ''}
          onChange={e => setParam('ranchId', e.target.value || undefined)}
          aria-label={t('fields.ranch')}
        >
          <option value="">{t('fields.ranch')}</option>
          {(ranches.data ?? []).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select
          className="border rounded px-2 py-2 bg-background text-base"
          value={params.get('breedId') ?? ''}
          onChange={e => setParam('breedId', e.target.value || undefined)}
          aria-label={t('fields.breed')}
        >
          <option value="">{t('fields.breed')}</option>
          {(breeds.data ?? []).map(b => <option key={b.id} value={b.id}>{b.nameEs}</option>)}
        </select>
        <select
          className="border rounded px-2 py-2 bg-background text-base"
          value={params.get('status') ?? ''}
          onChange={e => setParam('status', e.target.value || undefined)}
          aria-label={t('fields.status')}
        >
          <option value="">{t('fields.status')}</option>
          {(['ACTIVE','SOLD','DEAD','MISSING','TRANSFERRED'] as const).map(s =>
            <option key={s} value={s}>{t(`status.${s}`)}</option>
          )}
        </select>

        <div className="ml-auto inline-flex rounded-md border overflow-hidden" role="group" aria-label="Vista">
          <button
            type="button"
            onClick={() => setView('list')}
            aria-pressed={mode === 'list'}
            className={`flex items-center gap-1 px-3 py-2 text-sm ${mode === 'list' ? 'bg-accent font-semibold' : 'hover:bg-accent'}`}
          >
            <List className="h-4 w-4" aria-hidden /> Lista
          </button>
          <button
            type="button"
            onClick={() => setView('cards')}
            aria-pressed={mode === 'cards'}
            className={`flex items-center gap-1 px-3 py-2 text-sm border-l ${mode === 'cards' ? 'bg-accent font-semibold' : 'hover:bg-accent'}`}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden /> Tarjetas
          </button>
          <button
            type="button"
            onClick={() => setView('map')}
            aria-pressed={mode === 'map'}
            className={`flex items-center gap-1 px-3 py-2 text-sm border-l ${mode === 'map' ? 'bg-accent font-semibold' : 'hover:bg-accent'}`}
          >
            <MapIcon className="h-4 w-4" aria-hidden /> Mapa
          </button>
        </div>
      </div>

      {mode === 'map' ? (
        <RanchMap />
      ) : list.isLoading ? (
        <div className="text-muted-foreground">{tc('loading')}</div>
      ) : !list.data?.content?.length ? (
        <EmptyState
          icon={MapPin}
          title="No hay animales que coincidan"
          description="Cambia los filtros o quita la búsqueda. También puedes agregar un animal nuevo."
          ctaLabel={t('new')}
          onCta={() => window.location.assign('/animales/nuevo')}
        />
      ) : mode === 'cards' ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {list.data.content.map(a => (
            <AnimalCard
              key={a.id}
              animal={a}
              statusLabel={t(`status.${a.status}`)}
              badges={badgesByAnimal.get(a.id) ?? []}
            />
          ))}
        </ul>
      ) : (
        <ul className="divide-y border rounded-xl overflow-hidden">
          {list.data.content.map(a => {
            const aBadges = badgesByAnimal.get(a.id) ?? [];
            return (
              <li key={a.id}>
                <Link
                  to={`/animales/${a.id}`}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-accent transition-colors"
                >
                  {a.coverPhotoUrl ? (
                    <img
                      src={a.coverPhotoUrl}
                      alt={a.name ? `${a.name} (${a.internalTag})` : a.internalTag}
                      className="h-14 w-14 rounded-full object-cover shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <AnimalAvatar
                      photoUrl={undefined}
                      internalTag={a.internalTag}
                      name={a.name}
                      size={56}
                    />
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate">{a.internalTag}</p>
                      {a.name ? <p className="text-sm text-muted-foreground truncate">· {a.name}</p> : null}
                    </div>
                    {aBadges.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {aBadges.map(b => <BadgeChip key={b} kind={b} />)}
                      </div>
                    ) : null}
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {t(`sex.${a.sex}`)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusToneClass(a.status)}`}>
                    {t(`status.${a.status}`)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {list.data && list.data.totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          <BigButton label={tc('actions.prev')} variant="outline" disabled={page === 0} onClick={() => setParam('page', String(page - 1))} />
          <span className="self-center">{page + 1} / {list.data.totalPages}</span>
          <BigButton label={tc('actions.next')} variant="outline" disabled={page >= list.data.totalPages - 1} onClick={() => setParam('page', String(page + 1))} />
        </div>
      )}
    </div>
  );
}

function BadgeChip({ kind }: { kind: AnimalBadge }) {
  const meta = BADGE_META[kind];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span
      title={meta.label}
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {meta.short}
    </span>
  );
}

interface AnimalCardProps {
  animal: AnimalListItem;
  statusLabel: string;
  badges: AnimalBadge[];
}

function AnimalCard({ animal, statusLabel, badges }: AnimalCardProps) {
  return (
    <li>
      <Link
        to={`/animales/${animal.id}`}
        className="block rounded-xl border overflow-hidden hover:shadow-md transition-shadow bg-background"
      >
        <div className="aspect-square bg-muted relative">
          {animal.coverPhotoUrl ? (
            <img
              src={animal.coverPhotoUrl}
              alt={animal.name ? `${animal.name} (${animal.internalTag})` : animal.internalTag}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <AnimalAvatar photoUrl={null} internalTag={animal.internalTag} name={animal.name} size={96} />
            </div>
          )}
          <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${statusToneClass(animal.status)}`}>
            {statusLabel}
          </span>
        </div>
        <div className="p-3 space-y-1">
          <p className="font-semibold truncate">{animal.internalTag}</p>
          {animal.name ? <p className="text-sm text-muted-foreground truncate">{animal.name}</p> : null}
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-1 pt-1">
              {badges.map(b => <BadgeChip key={b} kind={b} />)}
            </div>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

function statusToneClass(s: AnimalListItem['status']): string {
  switch (s) {
    case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    case 'SOLD': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
    case 'DEAD': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    case 'MISSING': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
    default: return 'bg-muted text-muted-foreground';
  }
}
