import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateTreatment, useTreatments } from '@/features/health/treatments/api';
import { TreatmentForm } from '@/features/health/treatments/components/TreatmentForm';
import { useMedications } from '@/features/catalog/api/medications';
import { localizedName } from '@/lib/catalog';

/**
 * Pagina de listado y creacion de tratamientos.
 */
export default function TreatmentsPage() {
  const { t } = useTranslation(['health', 'common']);
  const [open, setOpen] = useState(false);
  const list = useTreatments();
  const medications = useMedications();
  const create = useCreateTreatment();
  const locale = i18n.language;

  const medName = (id: number) => {
    const m = medications.data?.find(x => x.id === id);
    return m ? localizedName(m, locale) : '-';
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('health:treatment.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('health:treatment.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('health:treatment.new')}</DialogTitle></DialogHeader>
            <TreatmentForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('health:treatment.startedAt')}</th>
            <th className="p-2 text-left">{t('health:treatment.medication')}</th>
            <th className="p-2 text-left">{t('health:treatment.withdrawalMilk')}</th>
            <th className="p-2 text-left">{t('health:treatment.withdrawalMeat')}</th>
          </tr>
        </thead>
        <tbody>
          {list.data?.map(tr => (
            <tr key={tr.id} className="border-t">
              <td className="p-2">{tr.startedAt}</td>
              <td className="p-2">{medName(tr.medicationId)}</td>
              <td className="p-2">{tr.withdrawalMilkUntil ?? '-'}</td>
              <td className="p-2">{tr.withdrawalMeatUntil ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
