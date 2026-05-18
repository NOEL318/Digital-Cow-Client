import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { animalsApi } from '@/features/animals/api';
import { useLots } from '../api';
import { useDashboardHealth } from '@/features/health/dashboard/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnimalListItem, Page, Purpose, Sex } from '@/features/animals/types';

interface Props {
  /** Id del rancho a resumir. */
  ranchId: number;
}

/**
 * Cards de resumen para un rancho: total activos, lotes, conteos por proposito y sexo.
 * Para el conteo por proposito hace 3 queries server-side (DAIRY, BEEF, DUAL) ya que el
 * AnimalListItem no incluye el campo purpose. Para sexo filtra el listado base.
 */
export function RanchSummaryCards({ ranchId }: Props) {
  const { t } = useTranslation(['ranches', 'animals', 'health']);

  const baseFilters = { ranchId, status: 'ACTIVE' as const, size: 500, page: 0 };
  const active = useQuery({
    queryKey: ['animals', baseFilters],
    queryFn: () => animalsApi.list(baseFilters)
  });
  const lots = useLots(ranchId);
  const health = useDashboardHealth();

  const dairy = useQuery({
    queryKey: ['animals', { ...baseFilters, purpose: 'DAIRY' as Purpose }],
    queryFn: () => animalsApi.list({ ...baseFilters, purpose: 'DAIRY' })
  });
  const beef = useQuery({
    queryKey: ['animals', { ...baseFilters, purpose: 'BEEF' as Purpose }],
    queryFn: () => animalsApi.list({ ...baseFilters, purpose: 'BEEF' })
  });
  const dual = useQuery({
    queryKey: ['animals', { ...baseFilters, purpose: 'DUAL' as Purpose }],
    queryFn: () => animalsApi.list({ ...baseFilters, purpose: 'DUAL' })
  });

  const sexCounts = useMemo(() => {
    const content = (active.data as Page<AnimalListItem> | undefined)?.content ?? [];
    return content.reduce<Record<Sex, number>>(
      (acc, a) => { acc[a.sex] = (acc[a.sex] ?? 0) + 1; return acc; },
      { FEMALE: 0, MALE: 0 }
    );
  }, [active.data]);

  const totalActive = active.data?.totalElements ?? 0;
  const totalLots = (lots.data ?? []).length;
  const dairyCount = dairy.data?.totalElements ?? 0;
  const beefCount = beef.data?.totalElements ?? 0;
  const dualCount = dual.data?.totalElements ?? 0;
  const vetSpend = health.data?.monthVetSpend;

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('ranches:detail.activeAnimals')}</CardTitle></CardHeader>
        <CardContent className="text-2xl font-bold">{totalActive}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('ranches:detail.totalLots')}</CardTitle></CardHeader>
        <CardContent className="text-2xl font-bold">{totalLots}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('ranches:detail.byPurpose')}</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          <div className="flex justify-between"><span>{t('animals:purpose.DAIRY')}</span><span className="font-semibold">{dairyCount}</span></div>
          <div className="flex justify-between"><span>{t('animals:purpose.BEEF')}</span><span className="font-semibold">{beefCount}</span></div>
          <div className="flex justify-between"><span>{t('animals:purpose.DUAL')}</span><span className="font-semibold">{dualCount}</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('ranches:detail.bySex')}</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1">
          <div className="flex justify-between"><span>{t('animals:sex.FEMALE')}</span><span className="font-semibold">{sexCounts.FEMALE}</span></div>
          <div className="flex justify-between"><span>{t('animals:sex.MALE')}</span><span className="font-semibold">{sexCounts.MALE}</span></div>
        </CardContent>
      </Card>
      {vetSpend !== undefined && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('ranches:detail.monthVetSpend')}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{Number(vetSpend).toFixed(2)}</CardContent>
        </Card>
      )}
    </div>
  );
}
