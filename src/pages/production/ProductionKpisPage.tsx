/**
 * Esta pagina muestra los indicadores clave de produccion del rancho.
 */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { useProductionKpis } from '@/features/production/kpis/api';

/** Devuelve ISO YYYY-MM-DD para una fecha. */
function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Rango por defecto: ultimos 30 dias. */
function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from: toIso(from), to: toIso(to) };
}

/** Pagina de KPIs de produccion: rango + cards + tabla top productoras. */
export default function ProductionKpisPage() {
  const { t } = useTranslation(['production', 'common']);
  const initial = useMemo(defaultRange, []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const kpis = useProductionKpis(from, to);

  const fmt = (n?: number | null) => (n === null || n === undefined) ? '-' : Number(n).toFixed(2);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('production:kpis.title')}</h1>
      <div className="flex gap-4 items-end">
        <div>
          <Label htmlFor="from">{t('production:kpis.from')}</Label>
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="to">{t('production:kpis.to')}</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      {kpis.isLoading ? (
        <p>{t('common:loading')}</p>
      ) : kpis.data ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Card>
              <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('production:kpis.totalMilkLiters')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">{fmt(kpis.data.totalMilkLiters)}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('production:kpis.avgDailyMilkLiters')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">{fmt(kpis.data.avgDailyMilkLiters)}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('production:kpis.avgAdgKgDay')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">{fmt(kpis.data.avgAdgKgDay)}</CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>{t('production:kpis.topProducers')}</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('production:kpis.tag')}</TableHead>
                    <TableHead>{t('production:kpis.liters')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpis.data.topProducers.map(p => (
                    <TableRow key={p.animalId}>
                      <TableCell>{p.internalTag}</TableCell>
                      <TableCell className="font-semibold text-green-700 dark:text-green-400">
                        {fmt(p.liters)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
