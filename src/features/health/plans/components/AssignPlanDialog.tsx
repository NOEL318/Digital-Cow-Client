/**
 * Este componente es un dialogo modal del modulo health/plans para una accion especifica.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAnimals } from '@/features/animals/api';
import { useRanches, useLots } from '@/features/ranches/api';
import { useAssignPlan } from '../api';

interface Props {
  planId: number;
  trigger: React.ReactNode;
}

type Tab = 'animals' | 'lots';

/**
 * Dialog para asignar un plan sanitario a animales o lotes (multi-select).
 */
export function AssignPlanDialog({ planId, trigger }: Props) {
  const { t } = useTranslation(['health', 'common']);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('animals');
  const [animalIds, setAnimalIds] = useState<number[]>([]);
  const [lotIds, setLotIds] = useState<number[]>([]);
  const [ranchId, setRanchId] = useState<number | undefined>(undefined);
  const animals = useAnimals({ size: 200 });
  const ranches = useRanches();
  const lots = useLots(ranchId);
  const assign = useAssignPlan(planId);

  const toggle = (arr: number[], setter: (v: number[]) => void, id: number) => {
    setter(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  };

  const submit = async () => {
    await assign.mutateAsync({
      animalIds: animalIds.length > 0 ? animalIds : undefined,
      lotIds: lotIds.length > 0 ? lotIds : undefined
    });
    setAnimalIds([]);
    setLotIds([]);
    setOpen(false);
  };

  const tabBtn = (k: Tab) =>
    `px-3 py-1 rounded ${tab === k ? 'bg-accent font-medium' : 'border'}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{t('health:plan.assign')}</DialogTitle></DialogHeader>
        <div className="flex gap-2">
          <button type="button" className={tabBtn('animals')} onClick={() => setTab('animals')}>{t('health:plan.animals')}</button>
          <button type="button" className={tabBtn('lots')} onClick={() => setTab('lots')}>{t('health:plan.lots')}</button>
        </div>
        {tab === 'animals' ? (
          <div className="max-h-64 overflow-y-auto border rounded p-2 space-y-1">
            {animals.data?.content.map(a => (
              <label key={a.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={animalIds.includes(a.id)}
                  onChange={() => toggle(animalIds, setAnimalIds, a.id)}
                />
                {a.internalTag}{a.name ? ` - ${a.name}` : ''}
              </label>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <select
              value={ranchId ?? ''}
              onChange={e => setRanchId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full border rounded h-10 px-2 bg-background"
            >
              <option value="">--</option>
              {ranches.data?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div className="max-h-64 overflow-y-auto border rounded p-2 space-y-1">
              {lots.data?.map(l => (
                <label key={l.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={lotIds.includes(l.id)}
                    onChange={() => toggle(lotIds, setLotIds, l.id)}
                  />
                  {l.name}
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>{t('common:actions.cancel')}</Button>
          <Button onClick={submit} disabled={assign.isPending}>{t('common:actions.save')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
