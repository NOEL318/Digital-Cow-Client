import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { useRanches, useLots } from '@/features/ranches/api';
import { useCreateMilkingBulk } from '../api';
import type { MilkingSession } from '../types';

/**
 * Formulario masivo de ordeño: el usuario selecciona rancho/lote y sesion,
 * obtiene los animales activos del lote y captura litros por fila. Envia
 * todo en una sola llamada bulk.
 */
export function MilkingBulkForm({ onDone }: { onDone?: () => void }) {
  const { t } = useTranslation(['production', 'common']);
  const today = new Date().toISOString().slice(0, 10);
  const [milkingDate, setMilkingDate] = useState(today);
  const [session, setSession] = useState<MilkingSession>('TOTAL');
  const [ranchId, setRanchId] = useState<number | undefined>(undefined);
  const [lotId, setLotId] = useState<number | undefined>(undefined);
  const ranches = useRanches();
  const lots = useLots(ranchId);
  const animals = useAnimals({ size: 500 });
  const bulk = useCreateMilkingBulk();

  const lotAnimals = useMemo(() => {
    if (!lotId) return [];
    return (animals.data?.content ?? []).filter(a => a.lotId === lotId && a.status === 'ACTIVE');
  }, [animals.data, lotId]);

  const [values, setValues] = useState<Record<number, string>>({});

  const update = (id: number, v: string) => setValues(prev => ({ ...prev, [id]: v }));

  const submit = async () => {
    const payload = lotAnimals
      .map(a => ({ animalId: a.id, liters: Number(values[a.id]) }))
      .filter(x => !Number.isNaN(x.liters) && x.liters > 0);
    if (payload.length === 0) return;
    await bulk.mutateAsync({ milkingDate, session, animals: payload });
    setValues({});
    onDone?.();
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <Label>{t('production:milking.milkingDate')}</Label>
          <Input type="date" value={milkingDate} onChange={e => setMilkingDate(e.target.value)} />
        </div>
        <div>
          <Label>{t('production:milking.session')}</Label>
          <select
            value={session}
            onChange={e => setSession(e.target.value as MilkingSession)}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            {(['TOTAL', 'AM', 'PM'] as const).map(s => (
              <option key={s} value={s}>{t(`production:milking.sessionValue.${s}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>{t('production:bulkTank.ranch')}</Label>
          <select
            value={ranchId ?? ''}
            onChange={e => { setRanchId(e.target.value ? Number(e.target.value) : undefined); setLotId(undefined); }}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            <option value="">--</option>
            {ranches.data?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <Label>{t('production:milking.lot')}</Label>
          <select
            value={lotId ?? ''}
            onChange={e => setLotId(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border rounded h-10 px-2 bg-background"
            disabled={!ranchId}
          >
            <option value="">--</option>
            {lots.data?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      </div>

      {!lotId ? (
        <p className="text-sm text-muted-foreground">{t('production:milking.selectLot')}</p>
      ) : lotAnimals.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('production:milking.noActiveAnimals')}</p>
      ) : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">{t('production:milking.animal')}</th>
              <th className="p-2 text-left w-40">{t('production:milking.liters')}</th>
            </tr>
          </thead>
          <tbody>
            {lotAnimals.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.internalTag}{a.name ? ` - ${a.name}` : ''}</td>
                <td className="p-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={values[a.id] ?? ''}
                    onChange={e => update(a.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Button onClick={submit} disabled={bulk.isPending || !lotId || lotAnimals.length === 0}>
        {t('production:milking.save')}
      </Button>
    </div>
  );
}
