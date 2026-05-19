/**
 * Esta pagina lista las entregas del tanque a granel registradas.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBulkTankDeliveries, useCreateBulkTankDelivery } from '@/features/production/bulkTank/api';
import { BulkTankDeliveryForm } from '@/features/production/bulkTank/components/BulkTankDeliveryForm';

/** Pagina de listado de entregas a tanque a granel. */
export default function BulkTankPage() {
  const { t } = useTranslation(['production', 'common']);
  const deliveries = useBulkTankDeliveries();
  const create = useCreateBulkTankDelivery();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('production:bulkTank.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('production:bulkTank.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('production:bulkTank.new')}</DialogTitle></DialogHeader>
            <BulkTankDeliveryForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('production:bulkTank.deliveryDate')}</th>
            <th className="p-2 text-left">{t('production:bulkTank.ranch')}</th>
            <th className="p-2 text-left">{t('production:bulkTank.totalLiters')}</th>
            <th className="p-2 text-left">{t('production:bulkTank.buyer')}</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.data?.map(d => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.deliveryDate}</td>
              <td className="p-2">{d.ranchId}</td>
              <td className="p-2">{d.totalLiters}</td>
              <td className="p-2">{d.buyer ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
