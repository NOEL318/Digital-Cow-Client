/**
 * Esta pagina lista los servicios reproductivos registrados, ya sean montas o inseminaciones.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reproduction:service.animal')}</TableHead>
            <TableHead>{t('reproduction:service.serviceDate')}</TableHead>
            <TableHead>{t('reproduction:service.serviceType')}</TableHead>
            <TableHead>{t('reproduction:service.bull')}</TableHead>
            <TableHead>{t('reproduction:service.technician')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.data?.map(s => (
            <TableRow key={s.id}>
              <TableCell>#{s.animalId}</TableCell>
              <TableCell>{s.serviceDate}</TableCell>
              <TableCell>
                <Badge tone={s.serviceType === 'AI' ? 'info' : s.serviceType === 'EMBRYO_TRANSFER' ? 'primary' : 'neutral'}>
                  {t(`reproduction:service.type.${s.serviceType}`)}
                </Badge>
              </TableCell>
              <TableCell>{s.bullId ? `#${s.bullId}` : '-'}</TableCell>
              <TableCell>{s.technicianName ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
