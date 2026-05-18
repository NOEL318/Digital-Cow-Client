import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRanches, useLots } from '@/features/ranches/api';
import { useAssignPlanToLot } from '../api';

interface Props {
  planId: number;
  trigger: React.ReactNode;
}

/** Dialog para asignar un plan de alimentacion a un lote. */
export function LotAssignmentDialog({ planId, trigger }: Props) {
  const { t } = useTranslation(['feeding', 'common']);
  const [open, setOpen] = useState(false);
  const [ranchId, setRanchId] = useState<number | undefined>(undefined);
  const [lotId, setLotId] = useState<number | undefined>(undefined);
  const [assignedAt, setAssignedAt] = useState(new Date().toISOString().slice(0, 10));
  const ranches = useRanches();
  const lots = useLots(ranchId);
  const assign = useAssignPlanToLot();

  const submit = async () => {
    if (!lotId) return;
    await assign.mutateAsync({ lotId, feedingPlanId: planId, assignedAt });
    setOpen(false);
    setLotId(undefined);
    setRanchId(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{t('feeding:plan.assign')}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>{t('feeding:plan.ranch')}</Label>
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
            <Label>{t('feeding:plan.lot')}</Label>
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
          <div>
            <Label>{t('feeding:plan.assignedAt')}</Label>
            <Input type="date" value={assignedAt} onChange={e => setAssignedAt(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>{t('common:actions.cancel')}</Button>
          <Button onClick={submit} disabled={assign.isPending || !lotId}>{t('common:actions.save')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
