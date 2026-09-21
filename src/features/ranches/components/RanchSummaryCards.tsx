/**
 * Este componente muestra una tarjeta resumen del modulo ranches.
 */
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
      <Card className="glass-gradient-emerald border-l-4 border-l-emerald-600">
        <CardHeader><CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{t('ranches:detail.activeAnimals')}</CardTitle></CardHeader>
        <CardContent className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{totalActive}</CardContent>
      </Card>
      <Card className="glass-gradient-blue border-l-4 border-l-blue-600">
        <CardHeader><CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">{t('ranches:detail.totalLots')}</CardTitle></CardHeader>
        <CardContent className="text-2xl font-black text-blue-700 dark:text-blue-400">{totalLots}</CardContent>
      </Card>
      <Card className="glass-gradient-amber border-l-4 border-l-amber-600">
        <CardHeader><CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">{t('ranches:detail.byPurpose')}</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1 text-card-foreground">
          <div className="flex justify-between"><span>{t('animals:purpose.DAIRY')}</span><span className="font-semibold">{dairyCount}</span></div>
          <div className="flex justify-between"><span>{t('animals:purpose.BEEF')}</span><span className="font-semibold">{beefCount}</span></div>
          <div className="flex justify-between"><span>{t('animals:purpose.DUAL')}</span><span className="font-semibold">{dualCount}</span></div>
        </CardContent>
      </Card>
      <Card className="glass-gradient-purple border-l-4 border-l-purple-600">
        <CardHeader><CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">{t('ranches:detail.bySex')}</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1 text-card-foreground">
          <div className="flex justify-between"><span>{t('animals:sex.FEMALE')}</span><span className="font-semibold">{sexCounts.FEMALE}</span></div>
          <div className="flex justify-between"><span>{t('animals:sex.MALE')}</span><span className="font-semibold">{sexCounts.MALE}</span></div>
        </CardContent>
      </Card>
      {vetSpend !== undefined && (
        <Card className="md:col-span-2 lg:col-span-4 glass-card border-l-4 border-l-teal-600">
          <CardHeader><CardTitle className="text-sm font-medium text-muted-foreground">{t('ranches:detail.monthVetSpend')}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-black text-foreground">${Number(vetSpend).toFixed(2)}</CardContent>
        </Card>
      )}
    </div>
  );
}
