/**
 * Esta pagina lista los secados registrados para las vacas en transicion.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useDryOffs, useCreateDryOff } from '@/features/reproduction/dryOffs/api';
import { DryOffForm } from '@/features/reproduction/dryOffs/components/DryOffForm';

/** Pagina de listado de secados. */
export default function DryOffsPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const dryOffs = useDryOffs();
  const create = useCreateDryOff();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:dryOff.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:dryOff.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('reproduction:dryOff.new')}</DialogTitle></DialogHeader>
            <DryOffForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reproduction:dryOff.driedOffAt')}</TableHead>
            <TableHead>{t('reproduction:dryOff.animal')}</TableHead>
            <TableHead className="text-right">{t('reproduction:dryOff.lactationDays')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dryOffs.data?.map(d => (
            <TableRow key={d.id}>
              <TableCell>{d.driedOffAt}</TableCell>
              <TableCell>{d.animalId}</TableCell>
              <TableCell className="text-right">{d.lactationDays ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
