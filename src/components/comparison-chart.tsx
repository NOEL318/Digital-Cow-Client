import { useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { useAnimalComparison } from '@/features/animals/comparison/api';
import { PageHelp } from '@/components/ui/page-help';

type Series = 'weight' | 'feed' | 'expense' | 'income';

const SERIES_META: Record<Series, { label: string; color: string; unit: string; kind: 'line' | 'bar' }> = {
  weight: { label: 'Peso (kilogramos)', color: '#0f766e', unit: 'kg', kind: 'line' },
  feed: { label: 'Alimento del lote (kilogramos)', color: '#a16207', unit: 'kg', kind: 'bar' },
  expense: { label: 'Gasto del mes', color: '#be185d', unit: '$', kind: 'bar' },
  income: { label: 'Ingreso del mes', color: '#0369a1', unit: '$', kind: 'bar' }
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
  const { data, isLoading } = useAnimalComparison({ animalId });
  const [selected, setSelected] = useState<Record<Series, boolean>>(DEFAULT_SELECTED);

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
        <h2 className="text-lg font-bold">Comparacion mes a mes</h2>
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
                style={{ backgroundColor: SERIES_META[s].color }}
                aria-hidden
              />
              {SERIES_META[s].label}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <p className="text-muted-foreground py-8 text-center">Cargando...</p>
      ) : !data || chartData.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          Aun no hay suficientes datos para comparar.
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
                <Line yAxisId="left" type="monotone" dataKey="weight" name={SERIES_META.weight.label} stroke={SERIES_META.weight.color} strokeWidth={2} dot={{ r: 3 }} connectNulls />
              ) : null}
              {selected.feed ? (
                <Bar yAxisId="left" dataKey="feed" name={SERIES_META.feed.label} fill={SERIES_META.feed.color} />
              ) : null}
              {selected.expense ? (
                <Bar yAxisId="right" dataKey="expense" name={SERIES_META.expense.label} fill={SERIES_META.expense.color} />
              ) : null}
              {selected.income ? (
                <Bar yAxisId="right" dataKey="income" name={SERIES_META.income.label} fill={SERIES_META.income.color} />
              ) : null}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <PageHelp text="Compara cuatro cosas del mismo animal en el mismo gráfico, mes a mes: cuánto pesa, cuánto alimento consumió su lote, cuánto te costó (medicinas, vacunas, gastos asignados) y cuánto te ha dado (ventas de leche, venta del animal). Sirve para responder: ¿esta vaca produce más de lo que cuesta? ¿está subiendo de peso? Toca los chips de arriba para encender o apagar cada serie." />
    </section>
  );
}
