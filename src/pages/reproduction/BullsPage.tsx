/**
 * Esta pagina lista los toros del rancho con sus datos reproductivos.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBulls, useCreateBull } from '@/features/reproduction/bulls/api';
import { BullForm } from '@/features/reproduction/bulls/components/BullForm';

/** Pagina de listado de toros. */
export default function BullsPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const bulls = useBulls();
  const create = useCreateBull();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:bull.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:bull.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('reproduction:bull.new')}</DialogTitle></DialogHeader>
            <BullForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('reproduction:bull.internalCode')}</th>
            <th className="p-2 text-left">{t('reproduction:bull.name')}</th>
            <th className="p-2 text-left">{t('reproduction:bull.source')}</th>
            <th className="p-2 text-left">{t('reproduction:bull.registryNumber')}</th>
          </tr>
        </thead>
        <tbody>
          {bulls.data?.map(b => (
            <tr key={b.id} className="border-t">
              <td className="p-2">{b.internalCode}</td>
              <td className="p-2">{b.name}</td>
              <td className="p-2">{t(`reproduction:bull.${b.source}`)}</td>
              <td className="p-2">{b.registryNumber ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
