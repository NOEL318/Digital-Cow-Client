/**
 * Esta pagina lista los servicios reproductivos registrados, ya sean montas o inseminaciones.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useServiceEvents, useCreateServiceEvent } from '@/features/reproduction/services/api';
import { ServiceEventForm } from '@/features/reproduction/services/components/ServiceEventForm';

/** Pagina de listado de servicios reproductivos. */
export default function ServicesPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const services = useServiceEvents();
  const create = useCreateServiceEvent();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:service.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:service.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('reproduction:service.new')}</DialogTitle></DialogHeader>
            <ServiceEventForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('reproduction:service.animal')}</th>
            <th className="p-2 text-left">{t('reproduction:service.serviceDate')}</th>
            <th className="p-2 text-left">{t('reproduction:service.serviceType')}</th>
            <th className="p-2 text-left">{t('reproduction:service.bull')}</th>
            <th className="p-2 text-left">{t('reproduction:service.technician')}</th>
          </tr>
        </thead>
        <tbody>
          {services.data?.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">#{s.animalId}</td>
              <td className="p-2">{s.serviceDate}</td>
              <td className="p-2">{t(`reproduction:service.type.${s.serviceType}`)}</td>
              <td className="p-2">{s.bullId ? `#${s.bullId}` : '-'}</td>
              <td className="p-2">{s.technicianName ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
