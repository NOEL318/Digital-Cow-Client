import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateVetVisit, useVetVisits } from '@/features/health/vetVisits/api';
import { VetVisitForm } from '@/features/health/vetVisits/components/VetVisitForm';

/**
 * Pagina de listado de visitas veterinarias. Modal para nueva visita.
 */
export default function VetVisitsPage() {
  const { t } = useTranslation(['health', 'common']);
  const visits = useVetVisits();
  const create = useCreateVetVisit();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('health:visit.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('health:visit.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('health:visit.new')}</DialogTitle></DialogHeader>
            <VetVisitForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('health:visit.title')}</th>
            <th className="p-2 text-left">{t('health:visit.vetName')}</th>
            <th className="p-2 text-left">{t('health:visit.reason')}</th>
            <th className="p-2 text-right">{t('health:visit.totalCost')}</th>
          </tr>
        </thead>
        <tbody>
          {visits.data?.map(v => (
            <tr key={v.id} className="border-t">
              <td className="p-2">{v.visitedAt}</td>
              <td className="p-2">{v.vetName}</td>
              <td className="p-2">{v.reason}</td>
              <td className="p-2 text-right">{v.totalCost ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
