/**
 * Esta pagina muestra la curva de lactacion de las vacas en ordeno.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { useLactationCurve } from '@/features/production/lactationCurve/api';

/** Curva de lactancia: selector de animal + LineChart de litros/dia vs dia de lactancia. */
export default function LactationCurvePage() {
  const { t } = useTranslation(['production', 'common']);
  const animals = useAnimals({ size: 500 });
  const dairyFemales = animals.data?.content.filter(a => a.sex === 'FEMALE') ?? [];
  const [animalId, setAnimalId] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>('');
  const curve = useLactationCurve(animalId, startDate || undefined);

  const data = curve.data?.points.map(p => ({
    dayOfLactation: p.dayOfLactation,
    totalLiters: Number(p.totalLiters)
  })) ?? [];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('production:lactationCurve.title')}</h1>
      <div className="grid md:grid-cols-2 gap-3 max-w-2xl">
        <div>
          <Label>{t('production:lactationCurve.selectAnimal')}</Label>
          <select
            value={animalId ?? ''}
            onChange={e => setAnimalId(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            <option value="">--</option>
            {dairyFemales.map(a => (
              <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>{t('production:lactationCurve.startDate')}</Label>
          <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
      </div>

      {animalId && (
        <Card>
          <CardHeader><CardTitle>{t('production:lactationCurve.title')}</CardTitle></CardHeader>
          <CardContent style={{ height: 320 }}>
            {data.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('production:lactationCurve.empty')}</p>
            ) : (
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="dayOfLactation"
                    label={{ value: t('production:lactationCurve.dayOfLactation'), position: 'insideBottom', offset: -2 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalLiters" stroke="#0369a1" name={t('production:lactationCurve.litersAxis')} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
