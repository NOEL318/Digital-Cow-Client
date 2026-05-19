/**
 * Este componente es una pestana del detalle del modulo animals.
 */
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { animalsApi } from '@/features/animals/api';
import { useAnimalWeighings } from '@/features/production/weighings/api';
import { useAnimalMilkings } from '@/features/production/milkings/api';
import { useAnimalMilkSamples } from '@/features/production/milkSamples/api';
import { useAnimalSlaughterResults } from '@/features/production/slaughter/api';
import { useGrowthCurve } from '@/features/production/growthCurve/api';

/**
 * Tab Produccion del detalle de animal: weighings con mini-chart, milkings recientes
 * (solo si purpose es DAIRY o DUAL), muestras de leche y slaughter si existe.
 */
export function AnimalProductionTab() {
  const { id } = useParams();
  const animalId = Number(id);
  const { t } = useTranslation(['production', 'common']);
  const animal = useQuery({ queryKey: ['animal', animalId], queryFn: () => animalsApi.get(animalId) });
  const weighings = useAnimalWeighings(animalId);
  const milkings = useAnimalMilkings(animalId);
  const samples = useAnimalMilkSamples(animalId);
  const slaughter = useAnimalSlaughterResults(animalId);
  const curve = useGrowthCurve(animalId);

  const isDairy = animal.data?.purpose === 'DAIRY' || animal.data?.purpose === 'DUAL';

  const last30Milkings = useMemo(() => {
    if (!milkings.data) return [];
    const sorted = [...milkings.data].sort((a, b) => b.milkingDate.localeCompare(a.milkingDate));
    return sorted.slice(0, 30);
  }, [milkings.data]);

  const curveData = curve.data?.points.map(p => ({
    date: p.date,
    weightKg: Number(p.weightKg)
  })) ?? [];

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-semibold mb-2">{t('production:tab.weighings')}</h3>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">{t('production:weighing.weighedAt')}</th>
              <th className="p-2 text-left">{t('production:weighing.weightKg')}</th>
              <th className="p-2 text-left">{t('production:weighing.method')}</th>
              <th className="p-2 text-left">{t('production:weighing.bodyConditionScore')}</th>
            </tr>
          </thead>
          <tbody>
            {weighings.data?.length === 0 ? (
              <tr><td colSpan={4} className="p-2 text-sm text-muted-foreground">{t('production:tab.empty')}</td></tr>
            ) : weighings.data?.map(w => (
              <tr key={w.id} className="border-t">
                <td className="p-2">{w.weighedAt}</td>
                <td className="p-2">{w.weightKg}</td>
                <td className="p-2">{w.method ? t(`production:weighing.methodValue.${w.method}`) : '-'}</td>
                <td className="p-2">{w.bodyConditionScore ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {curveData.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">{t('production:tab.growthChart')}</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={curveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weightKg" stroke="#0f766e" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {isDairy && (
        <section>
          <h3 className="font-semibold mb-2">{t('production:tab.milkings')}</h3>
          <table className="w-full border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">{t('production:milking.milkingDate')}</th>
                <th className="p-2 text-left">{t('production:milking.session')}</th>
                <th className="p-2 text-left">{t('production:milking.liters')}</th>
              </tr>
            </thead>
            <tbody>
              {last30Milkings.length === 0 ? (
                <tr><td colSpan={3} className="p-2 text-sm text-muted-foreground">{t('production:tab.empty')}</td></tr>
              ) : last30Milkings.map(m => (
                <tr key={m.id} className="border-t">
                  <td className="p-2">{m.milkingDate}</td>
                  <td className="p-2">{t(`production:milking.sessionValue.${m.session}`)}</td>
                  <td className="p-2">{m.liters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {isDairy && (
        <section>
          <h3 className="font-semibold mb-2">{t('production:tab.milkSamples')}</h3>
          <table className="w-full border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">{t('production:milkSample.sampledAt')}</th>
                <th className="p-2 text-left">{t('production:milkSample.scc')}</th>
                <th className="p-2 text-left">{t('production:milkSample.fatPct')}</th>
                <th className="p-2 text-left">{t('production:milkSample.proteinPct')}</th>
                <th className="p-2 text-left">{t('production:milkSample.lactosePct')}</th>
              </tr>
            </thead>
            <tbody>
              {samples.data?.length === 0 ? (
                <tr><td colSpan={5} className="p-2 text-sm text-muted-foreground">{t('production:tab.empty')}</td></tr>
              ) : samples.data?.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.sampledAt}</td>
                  <td className="p-2">{s.sccCellsPerMl ?? '-'}</td>
                  <td className="p-2">{s.fatPct ?? '-'}</td>
                  <td className="p-2">{s.proteinPct ?? '-'}</td>
                  <td className="p-2">{s.lactosePct ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {slaughter.data && slaughter.data.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">{t('production:tab.slaughter')}</h3>
          <table className="w-full border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">{t('production:slaughter.slaughteredAt')}</th>
                <th className="p-2 text-left">{t('production:slaughter.liveWeightKg')}</th>
                <th className="p-2 text-left">{t('production:slaughter.carcassWeightKg')}</th>
                <th className="p-2 text-left">{t('production:slaughter.yieldPct')}</th>
                <th className="p-2 text-left">{t('production:slaughter.grade')}</th>
                <th className="p-2 text-left">{t('production:slaughter.buyer')}</th>
              </tr>
            </thead>
            <tbody>
              {slaughter.data.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.slaughteredAt}</td>
                  <td className="p-2">{s.liveWeightKg ?? '-'}</td>
                  <td className="p-2">{s.carcassWeightKg ?? '-'}</td>
                  <td className="p-2">{s.yieldPct ?? '-'}</td>
                  <td className="p-2">{s.grade ?? '-'}</td>
                  <td className="p-2">{s.buyer ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
