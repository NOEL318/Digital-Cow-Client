/**
 * Este componente muestra una tabla con registros del modulo ranches.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { animalsApi } from '@/features/animals/api';
import { breedsApi } from '@/features/breeds/api';
import { useLots } from '../api';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { sexStyle } from '@/features/animals/sex-style';
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('animals:fields.internalTag')}</TableHead>
          <TableHead>{t('animals:fields.breed')}</TableHead>
          <TableHead>{t('animals:fields.sex')}</TableHead>
          <TableHead>{t('animals:fields.status')}</TableHead>
          <TableHead>{t('ranches:lots.name')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recent.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
              {t('ranches:detail.noAnimals')}
            </TableCell>
          </TableRow>
        ) : recent.map(a => {
          const ss = sexStyle(a.sex);
          return (
            <TableRow key={a.id}>
              <TableCell>
                <Link to={`/animals/${a.id}`} className="underline font-medium">
                  {a.internalTag}
                </Link>
              </TableCell>
              <TableCell>{breedName(a.breedId)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ss.badge}`}>
                  {t(`animals:sex.${a.sex}`)}
                </span>
              </TableCell>
              <TableCell>{t(`animals:status.${a.status}`)}</TableCell>
              <TableCell>{lotName(a.lotId)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
