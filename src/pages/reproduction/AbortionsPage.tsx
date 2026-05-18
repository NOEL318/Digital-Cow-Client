import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAbortions, useCreateAbortion } from '@/features/reproduction/abortions/api';
import { AbortionForm } from '@/features/reproduction/abortions/components/AbortionForm';

/** Pagina de listado de abortos. */
export default function AbortionsPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const abortions = useAbortions();
  const create = useCreateAbortion();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:abortion.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:abortion.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('reproduction:abortion.new')}</DialogTitle></DialogHeader>
            <AbortionForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('reproduction:abortion.abortedAt')}</th>
            <th className="p-2 text-left">{t('reproduction:abortion.animal')}</th>
            <th className="p-2 text-left">{t('reproduction:abortion.estimatedGestationDays')}</th>
            <th className="p-2 text-left">{t('reproduction:abortion.cause')}</th>
          </tr>
        </thead>
        <tbody>
          {abortions.data?.map(a => (
            <tr key={a.id} className="border-t">
              <td className="p-2">{a.abortedAt}</td>
              <td className="p-2">{a.animalId}</td>
              <td className="p-2">{a.estimatedGestationDays ?? '-'}</td>
              <td className="p-2">{a.cause ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
