/**
 * Esta pagina lista los abortos registrados para las hembras del rancho.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reproduction:abortion.abortedAt')}</TableHead>
            <TableHead>{t('reproduction:abortion.animal')}</TableHead>
            <TableHead>{t('reproduction:abortion.estimatedGestationDays')}</TableHead>
            <TableHead>{t('reproduction:abortion.cause')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {abortions.data?.map(a => (
            <TableRow key={a.id}>
              <TableCell>{a.abortedAt}</TableCell>
              <TableCell>{a.animalId}</TableCell>
              <TableCell>{a.estimatedGestationDays ?? '-'}</TableCell>
              <TableCell>{a.cause ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
