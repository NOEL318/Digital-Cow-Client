import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFeedingPlans, useCreateFeedingPlan } from '@/features/feeding/plans/api';
import { FeedingPlanForm } from '@/features/feeding/plans/components/FeedingPlanForm';

/** Pagina con lista de planes de alimentacion y boton para crear. */
export default function FeedingPlansPage() {
  const { t } = useTranslation(['feeding', 'common']);
  const plans = useFeedingPlans();
  const create = useCreateFeedingPlan();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('feeding:plan.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('feeding:plan.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('feeding:plan.new')}</DialogTitle></DialogHeader>
            <FeedingPlanForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('feeding:plan.name')}</th>
            <th className="p-2 text-left">{t('feeding:plan.category')}</th>
            <th className="p-2 text-left">{t('feeding:plan.description')}</th>
          </tr>
        </thead>
        <tbody>
          {plans.data?.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">
                <Link to={`/feeding/plans/${p.id}`} className="underline">{p.name}</Link>
              </td>
              <td className="p-2">{t(`feeding:plan.categoryValue.${p.category}`)}</td>
              <td className="p-2">{p.description ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
