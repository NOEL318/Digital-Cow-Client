/**
 * Esta pagina lista las visitas veterinarias registradas en el rancho.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('health:visit.visitedAt')}</TableHead>
            <TableHead>{t('health:visit.vetName')}</TableHead>
            <TableHead>{t('health:visit.reason')}</TableHead>
            <TableHead className="text-right">{t('health:visit.totalCost')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.data?.map(v => (
            <TableRow key={v.id}>
              <TableCell>{v.visitedAt}</TableCell>
              <TableCell>{v.vetName}</TableCell>
              <TableCell>{v.reason}</TableCell>
              <TableCell className="text-right">{v.totalCost ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
