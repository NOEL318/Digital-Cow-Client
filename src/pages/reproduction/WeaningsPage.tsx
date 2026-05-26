/**
 * Esta pagina lista los destetes registrados para los terneros del rancho.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useWeanings, useCreateWeaning } from '@/features/reproduction/weanings/api';
import { WeaningForm } from '@/features/reproduction/weanings/components/WeaningForm';

/** Pagina de listado de destetes. */
export default function WeaningsPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const weanings = useWeanings();
  const create = useCreateWeaning();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:weaning.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:weaning.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('reproduction:weaning.new')}</DialogTitle></DialogHeader>
            <WeaningForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reproduction:weaning.weanedAt')}</TableHead>
            <TableHead>{t('reproduction:weaning.animal')}</TableHead>
            <TableHead className="text-right">{t('reproduction:weaning.weightKg')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weanings.data?.map(w => (
            <TableRow key={w.id}>
              <TableCell>{w.weanedAt}</TableCell>
              <TableCell>{w.animalId}</TableCell>
              <TableCell className="text-right">{w.weightKg ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
