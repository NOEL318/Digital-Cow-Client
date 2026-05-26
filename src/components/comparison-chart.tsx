/**
 * Este archivo contiene la grafica comparativa de un animal,
 * que muestra peso, alimento, gastos e ingresos mes a mes.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { useAnimalComparison } from '@/features/animals/comparison/api';
import { PageHelp } from '@/components/ui/page-help';

type Series = 'weight' | 'feed' | 'expense' | 'income';

// Semantic colors: income=success/green, expense=danger/red, weight=info/blue, feed=amber
const SERIES_COLORS: Record<Series, string> = {
  weight:  '#0ea5e9', // info blue
  feed:    '#f59e0b', // amber/warning
  expense: '#dc2626', // danger red
  income:  '#16a34a'  // success green
};

const DEFAULT_SELECTED: Record<Series, boolean> = {
  weight: true,
  feed: true,
  expense: false,
  income: false
};

interface ComparisonChartProps {
  animalId: number;
}

/**
 * Grafica comparativa por animal. Permite alternar entre cuatro
 * series (peso, alimento del lote, gasto, ingreso) y muestra una
 * leyenda interactiva con tooltips claros y unidades completas.
 */
export function ComparisonChart({ animalId }: ComparisonChartProps) {
  const { t } = useTranslation(['finance']);
  const { data, isLoading } = useAnimalComparison({ animalId });
  const [selected, setSelected] = useState<Record<Series, boolean>>(DEFAULT_SELECTED);

  const SERIES_META: Record<Series, { label: string; unit: string; kind: 'line' | 'bar' }> = {
    weight:  { label: t('finance:comparison.weight'),  unit: 'kg', kind: 'line' },
    feed:    { label: t('finance:comparison.feed'),    unit: 'kg', kind: 'bar' },
    expense: { label: t('finance:comparison.expense'), unit: '$',  kind: 'bar' },
    income:  { label: t('finance:comparison.income'),  unit: '$',  kind: 'bar' }
  };

  function toggle(s: Series) {
    setSelected(prev => ({ ...prev, [s]: !prev[s] }));
  }

  const chartData = (data?.points ?? []).map(p => ({
    month: p.yearMonth,
    weight: p.weightKg ?? null,
    feed: p.feedKg ?? null,
    expense: p.expense ?? null,
    income: p.income ?? null
  }));

  return (
    <section className="space-y-3 rounded-2xl border p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{t('finance:comparison.title')}</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SERIES_META) as Series[]).map(s => (
            <button
              key={s}
              type="button"
              aria-pressed={selected[s]}
              onClick={() => toggle(s)}
              className={`text-sm px-3 py-1.5 rounded-full border flex items-center gap-2 transition-colors ${
                selected[s] ? 'bg-accent font-semibold' : 'hover:bg-accent text-muted-foreground'
              }`}
            >
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: SERIES_COLORS[s] }}
                aria-hidden
              />
              {SERIES_META[s].label}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <p className="text-muted-foreground py-8 text-center">{t('finance:comparison.loading')}</p>
      ) : !data || chartData.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          {t('finance:comparison.noData')}
        </p>
      ) : (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value: number, name: string) => {
                const series = (Object.keys(SERIES_META) as Series[]).find(s => SERIES_META[s].label === name);
                const unit = series ? SERIES_META[series].unit : '';
                return [`${value} ${unit}`, name];
              }} />
              <Legend />
              {selected.weight ? (
                <Line yAxisId="left" type="monotone" dataKey="weight" name={SERIES_META.weight.label} stroke={SERIES_COLORS.weight} strokeWidth={2} dot={{ r: 3 }} connectNulls />
              ) : null}
              {selected.feed ? (
                <Bar yAxisId="left" dataKey="feed" name={SERIES_META.feed.label} fill={SERIES_COLORS.feed} />
              ) : null}
              {selected.expense ? (
                <Bar yAxisId="right" dataKey="expense" name={SERIES_META.expense.label} fill={SERIES_COLORS.expense} />
              ) : null}
              {selected.income ? (
                <Bar yAxisId="right" dataKey="income" name={SERIES_META.income.label} fill={SERIES_COLORS.income} />
              ) : null}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <PageHelp text={t('finance:comparison.help')} />
    </section>
  );
}
