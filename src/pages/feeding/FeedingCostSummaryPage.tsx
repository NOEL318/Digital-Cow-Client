/**
 * Esta pagina muestra el resumen de costos de alimentacion por lote y periodo.
 */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { useFeedingCostSummary, type CostGroupBy } from '@/features/feeding/costSummary/api';

/** Devuelve ISO YYYY-MM-DD para una fecha. */
function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Rango por defecto: ultimos 6 meses. */
function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 6);
  return { from: toIso(from), to: toIso(to) };
}

/**
 * Pagina de resumen de costos de alimentacion: filtros + BarChart + tabla.
 */
export default function FeedingCostSummaryPage() {
  const { t } = useTranslation(['feeding', 'common']);
  const initial = useMemo(defaultRange, []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [groupBy, setGroupBy] = useState<CostGroupBy>('month');
  const summary = useFeedingCostSummary(from, to, groupBy);

  const chartData = summary.data?.buckets.map(b => ({
    label: b.label,
    cost: Number(b.totalCost),
    kg: Number(b.totalKg)
  })) ?? [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('feeding:costSummary.title')}</h1>
      <div className="grid md:grid-cols-3 gap-3 max-w-2xl">
        <div>
          <Label htmlFor="from">{t('feeding:costSummary.from')}</Label>
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="to">{t('feeding:costSummary.to')}</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="groupBy">{t('feeding:costSummary.groupBy')}</Label>
          <select
            id="groupBy"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as CostGroupBy)}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            {(['lot', 'ranch', 'month'] as const).map(g => (
              <option key={g} value={g}>{t(`feeding:costSummary.groupByValue.${g}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {summary.isLoading ? (
        <p>{t('common:loading')}</p>
      ) : summary.data ? (
        <>
          <Card>
            <CardHeader><CardTitle>{t('feeding:costSummary.totalCost')}</CardTitle></CardHeader>
            <CardContent style={{ height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#0f766e" name={t('feeding:costSummary.totalCost')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('feeding:costSummary.key')}</TableHead>
                <TableHead>{t('feeding:costSummary.label')}</TableHead>
                <TableHead>{t('feeding:costSummary.totalCost')}</TableHead>
                <TableHead>{t('feeding:costSummary.totalKg')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.data.buckets.map(b => (
                <TableRow key={b.key}>
                  <TableCell>{b.key}</TableCell>
                  <TableCell>{b.label}</TableCell>
                  <TableCell className="font-semibold">{b.totalCost}</TableCell>
                  <TableCell>{b.totalKg}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : null}
    </div>
  );
}
