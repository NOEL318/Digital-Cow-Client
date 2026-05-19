/**
 * Esta pagina muestra los indicadores clave de reproduccion del rancho.
 */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReproductionKpis } from '@/features/reproduction/kpis/api';

/** Devuelve ISO YYYY-MM-DD para una fecha. */
function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Default range: ultimos 12 meses hasta hoy. */
function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 12);
  return { from: toIso(from), to: toIso(to) };
}

/**
 * Pagina de KPIs reproductivos.
 * Cards con metricas agregadas + BarChart placeholder de distribucion de dias abiertos
 * por bucket. La distribucion real se calcula client-side cuando hay datos (placeholder
 * en ceros si el backend no la expone).
 */
export default function ReproductionKpisPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const initial = useMemo(defaultRange, []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const kpis = useReproductionKpis(from, to);

  const fmt = (n?: number | null) => (n === null || n === undefined) ? '-' : n.toFixed(1);
  const pct = (n?: number | null) =>
    (n === null || n === undefined) ? '-' : `${(n * 100).toFixed(1)}%`;

  const distribution = [
    { bucket: t('reproduction:kpis.bucket0_60'), count: 0 },
    { bucket: t('reproduction:kpis.bucket61_90'), count: 0 },
    { bucket: t('reproduction:kpis.bucket91_120'), count: 0 },
    { bucket: t('reproduction:kpis.bucket121plus'), count: 0 }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('reproduction:kpis.title')}</h1>

      <div className="flex gap-4 items-end">
        <div>
          <Label htmlFor="from">{t('reproduction:kpis.from')}</Label>
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="to">{t('reproduction:kpis.to')}</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      {kpis.isLoading ? (
        <p>{t('common:loading')}</p>
      ) : kpis.data ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {t('reproduction:kpis.daysOpen')} - {t('reproduction:kpis.median')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{fmt(kpis.data.daysOpenMedian)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {t('reproduction:kpis.daysOpen')} - {t('reproduction:kpis.p75')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{fmt(kpis.data.daysOpenP75)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {t('reproduction:kpis.daysOpen')} - {t('reproduction:kpis.max')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{fmt(kpis.data.daysOpenMax)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{t('reproduction:kpis.iep')}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{fmt(kpis.data.iepDays)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{t('reproduction:kpis.firstCalvingAge')}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{fmt(kpis.data.firstCalvingAgeDays)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{t('reproduction:kpis.firstServiceConception')}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{pct(kpis.data.firstServiceConceptionRate)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{t('reproduction:kpis.servicesPerConception')}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{fmt(kpis.data.servicesPerConception)}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{t('reproduction:kpis.pregnancyRate')}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{pct(kpis.data.pregnancyRate)}</CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>{t('reproduction:kpis.distribution')}</CardTitle></CardHeader>
            <CardContent style={{ height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f766e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
