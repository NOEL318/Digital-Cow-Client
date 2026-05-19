/**
 * Este componente muestra una tabla con registros del modulo ranches.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { animalsApi } from '@/features/animals/api';
import { useLots } from '../api';
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
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead>
          <tr className="border-b text-left bg-muted">
            <th className="p-2">{t('lots.name')}</th>
            <th className="p-2">{t('fields.area')}</th>
            <th className="p-2 text-right">{t('detail.activeAnimals')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">{t('detail.noLots')}</td></tr>
          ) : rows.map(l => (
            <tr key={l.id} className="border-b hover:bg-accent">
              <td className="p-2">{l.name}</td>
              <td className="p-2">{l.areaHectares ?? '-'}</td>
              <td className="p-2 text-right">{countsByLot.get(l.id) ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
