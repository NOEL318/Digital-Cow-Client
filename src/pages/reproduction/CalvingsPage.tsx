import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCalvings, useCreateCalving } from '@/features/reproduction/calvings/api';
import { CalvingForm } from '@/features/reproduction/calvings/components/CalvingForm';

/** Pagina de listado de partos. */
export default function CalvingsPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const calvings = useCalvings();
  const create = useCreateCalving();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:calving.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:calving.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('reproduction:calving.new')}</DialogTitle></DialogHeader>
            <CalvingForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('reproduction:calving.calvedAt')}</th>
            <th className="p-2 text-left">{t('reproduction:calving.animal')}</th>
            <th className="p-2 text-left">{t('reproduction:calving.ease')}</th>
            <th className="p-2 text-left">{t('reproduction:calving.outcome')}</th>
            <th className="p-2 text-left">{t('reproduction:calving.calfSex')}</th>
          </tr>
        </thead>
        <tbody>
          {calvings.data?.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.calvedAt}</td>
              <td className="p-2">{c.animalId}</td>
              <td className="p-2">{t(`reproduction:calving.easeValue.${c.ease}`)}</td>
              <td className="p-2">{t(`reproduction:calving.outcomeValue.${c.outcome}`)}</td>
              <td className="p-2">{c.calfSex ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
