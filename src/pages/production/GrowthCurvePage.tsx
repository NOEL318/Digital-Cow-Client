/**
 * Esta pagina muestra la curva de crecimiento de un animal o grupo.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { useGrowthCurve } from '@/features/production/growthCurve/api';

/** Curva de crecimiento: selector de animal + LineChart de peso vs fecha. */
export default function GrowthCurvePage() {
  const { t } = useTranslation(['production', 'common']);
  const animals = useAnimals({ size: 500 });
  const [animalId, setAnimalId] = useState<number | undefined>(undefined);
  const curve = useGrowthCurve(animalId);

  const data = curve.data?.points.map(p => ({
    date: p.date,
    weightKg: Number(p.weightKg),
    adg: p.adgSincePrevious != null ? Number(p.adgSincePrevious) : null
  })) ?? [];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('production:growthCurve.title')}</h1>
      <div className="max-w-md">
        <Label>{t('production:growthCurve.selectAnimal')}</Label>
        <select
          value={animalId ?? ''}
          onChange={e => setAnimalId(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {animals.data?.content.map(a => (
            <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
          ))}
        </select>
      </div>

      {animalId && (
        <Card>
          <CardHeader><CardTitle>{t('production:growthCurve.title')}</CardTitle></CardHeader>
          <CardContent style={{ height: 320 }}>
            {data.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('production:growthCurve.empty')}</p>
            ) : (
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weightKg" stroke="#0f766e" name={t('production:growthCurve.weightAxis')} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
