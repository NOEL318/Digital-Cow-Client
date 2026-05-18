import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSemenStraws, useCreateSemenStraw } from '@/features/reproduction/semen/api';
import { useBulls } from '@/features/reproduction/bulls/api';
import { SemenStrawForm } from '@/features/reproduction/semen/components/SemenStrawForm';

/** Pagina de inventario de pajillas de semen. */
export default function SemenPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const straws = useSemenStraws();
  const bulls = useBulls();
  const create = useCreateSemenStraw();
  const [open, setOpen] = useState(false);
  const bullName = (id: number) => {
    const b = bulls.data?.find(x => x.id === id);
    return b ? `${b.name} (${b.internalCode})` : `#${id}`;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:semen.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:semen.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('reproduction:semen.new')}</DialogTitle></DialogHeader>
            <SemenStrawForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('reproduction:semen.bull')}</th>
            <th className="p-2 text-left">{t('reproduction:semen.batchNumber')}</th>
            <th className="p-2 text-right">{t('reproduction:semen.availableQuantity')}</th>
            <th className="p-2 text-right">{t('reproduction:semen.totalQuantity')}</th>
            <th className="p-2 text-left">{t('reproduction:semen.expiresAt')}</th>
          </tr>
        </thead>
        <tbody>
          {straws.data?.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{bullName(s.bullId)}</td>
              <td className="p-2">{s.batchNumber ?? '-'}</td>
              <td className="p-2 text-right">{s.availableQuantity}</td>
              <td className="p-2 text-right">{s.totalQuantity}</td>
              <td className="p-2">{s.expiresAt ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
