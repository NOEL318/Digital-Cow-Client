/**
 * Este componente muestra una tabla con registros del modulo ranches.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { animalsApi } from '@/features/animals/api';
import { useLots } from '../api';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import type { AnimalListItem, Page } from '@/features/animals/types';

interface Props {
  /** Id del rancho cuyos lotes se listan. */
  ranchId: number;
}

/** Tabla de lotes del rancho con conteo de animales activos por lote (client-side). */
export function RanchLotsTable({ ranchId }: Props) {
  const { t } = useTranslation('ranches');
  const lots = useLots(ranchId);

  const animals = useQuery({
    queryKey: ['animals', { ranchId, status: 'ACTIVE', size: 500, page: 0 }],
    queryFn: () => animalsApi.list({ ranchId, status: 'ACTIVE', size: 500, page: 0 })
  });

  const countsByLot = useMemo(() => {
    const content = (animals.data as Page<AnimalListItem> | undefined)?.content ?? [];
    const map = new Map<number, number>();
    for (const a of content) {
      if (a.lotId != null) map.set(a.lotId, (map.get(a.lotId) ?? 0) + 1);
    }
    return map;
  }, [animals.data]);

  const rows = lots.data ?? [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('lots.name')}</TableHead>
          <TableHead>{t('fields.area')}</TableHead>
          <TableHead className="text-right">{t('detail.activeAnimals')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
              {t('detail.noLots')}
            </TableCell>
          </TableRow>
        ) : rows.map(l => (
          <TableRow key={l.id}>
            <TableCell>{l.name}</TableCell>
            <TableCell>{l.areaHectares ?? '-'}</TableCell>
            <TableCell className="text-right">{countsByLot.get(l.id) ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
