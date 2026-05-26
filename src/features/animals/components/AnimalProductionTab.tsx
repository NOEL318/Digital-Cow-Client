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
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('production:weighing.weighedAt')}</TableHead>
              <TableHead>{t('production:weighing.weightKg')}</TableHead>
              <TableHead>{t('production:weighing.method')}</TableHead>
              <TableHead>{t('production:weighing.bodyConditionScore')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {weighings.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">{t('production:tab.empty')}</TableCell>
              </TableRow>
            ) : weighings.data?.map(w => (
              <TableRow key={w.id}>
                <TableCell>{w.weighedAt}</TableCell>
                <TableCell>{w.weightKg}</TableCell>
                <TableCell>{w.method ? t(`production:weighing.methodValue.${w.method}`) : '-'}</TableCell>
                <TableCell>{w.bodyConditionScore ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('production:milking.milkingDate')}</TableHead>
                <TableHead>{t('production:milking.session')}</TableHead>
                <TableHead>{t('production:milking.liters')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {last30Milkings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">{t('production:tab.empty')}</TableCell>
                </TableRow>
              ) : last30Milkings.map(m => (
                <TableRow key={m.id}>
                  <TableCell>{m.milkingDate}</TableCell>
                  <TableCell>{t(`production:milking.sessionValue.${m.session}`)}</TableCell>
                  <TableCell>{m.liters}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {isDairy && (
        <section>
          <h3 className="font-semibold mb-2">{t('production:tab.milkSamples')}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('production:milkSample.sampledAt')}</TableHead>
                <TableHead>{t('production:milkSample.scc')}</TableHead>
                <TableHead>{t('production:milkSample.fatPct')}</TableHead>
                <TableHead>{t('production:milkSample.proteinPct')}</TableHead>
                <TableHead>{t('production:milkSample.lactosePct')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {samples.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">{t('production:tab.empty')}</TableCell>
                </TableRow>
              ) : samples.data?.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.sampledAt}</TableCell>
                  <TableCell>{s.sccCellsPerMl ?? '-'}</TableCell>
                  <TableCell>{s.fatPct ?? '-'}</TableCell>
                  <TableCell>{s.proteinPct ?? '-'}</TableCell>
                  <TableCell>{s.lactosePct ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {slaughter.data && slaughter.data.length > 0 && (
        <section>
          <h3 className="font-semibold mb-2">{t('production:tab.slaughter')}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('production:slaughter.slaughteredAt')}</TableHead>
                <TableHead>{t('production:slaughter.liveWeightKg')}</TableHead>
                <TableHead>{t('production:slaughter.carcassWeightKg')}</TableHead>
                <TableHead>{t('production:slaughter.yieldPct')}</TableHead>
                <TableHead>{t('production:slaughter.grade')}</TableHead>
                <TableHead>{t('production:slaughter.buyer')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slaughter.data.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.slaughteredAt}</TableCell>
                  <TableCell>{s.liveWeightKg ?? '-'}</TableCell>
                  <TableCell>{s.carcassWeightKg ?? '-'}</TableCell>
                  <TableCell>{s.yieldPct ?? '-'}</TableCell>
                  <TableCell>{s.grade ?? '-'}</TableCell>
                  <TableCell>{s.buyer ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
}
