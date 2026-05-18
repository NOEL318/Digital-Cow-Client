import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { animalsApi } from '@/features/animals/api';
import { breedsApi } from '@/features/breeds/api';
import { useLots } from '../api';
import type { AnimalListItem, Page } from '@/features/animals/types';

interface Props {
  /** Id del rancho cuyos animales recientes se muestran. */
  ranchId: number;
}

/**
 * Tabla con los ultimos 10 animales del rancho. Como AnimalListItem no expone createdAt,
 * el "recientes" se aproxima ordenando por id descendente (asumido autoincremental).
 */
export function RanchAnimalsTable({ ranchId }: Props) {
  const { t } = useTranslation(['animals', 'ranches']);
  const locale = i18n.language;

  const animals = useQuery({
    queryKey: ['animals', { ranchId, size: 500, page: 0 }],
    queryFn: () => animalsApi.list({ ranchId, size: 500, page: 0 })
  });
  const breeds = useQuery({ queryKey: ['breeds'], queryFn: breedsApi.list });
  const lots = useLots(ranchId);

  const recent = useMemo(() => {
    const content = (animals.data as Page<AnimalListItem> | undefined)?.content ?? [];
    return [...content].sort((a, b) => b.id - a.id).slice(0, 10);
  }, [animals.data]);

  const breedName = (id: number) => {
    const b = (breeds.data ?? []).find(x => x.id === id);
    if (!b) return '-';
    return locale.startsWith('en') ? b.nameEn : b.nameEs;
  };
  const lotName = (id: number | null | undefined) => {
    if (id == null) return '-';
    return (lots.data ?? []).find(l => l.id === id)?.name ?? '-';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead>
          <tr className="border-b text-left bg-muted">
            <th className="p-2">{t('animals:fields.internalTag')}</th>
            <th className="p-2">{t('animals:fields.breed')}</th>
            <th className="p-2">{t('animals:fields.sex')}</th>
            <th className="p-2">{t('animals:fields.status')}</th>
            <th className="p-2">{t('ranches:lots.name')}</th>
          </tr>
        </thead>
        <tbody>
          {recent.length === 0 ? (
            <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">{t('ranches:detail.noAnimals')}</td></tr>
          ) : recent.map(a => (
            <tr key={a.id} className="border-b hover:bg-accent">
              <td className="p-2"><Link to={`/animals/${a.id}`} className="underline">{a.internalTag}</Link></td>
              <td className="p-2">{breedName(a.breedId)}</td>
              <td className="p-2">{t(`animals:sex.${a.sex}`)}</td>
              <td className="p-2">{t(`animals:status.${a.status}`)}</td>
              <td className="p-2">{lotName(a.lotId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
