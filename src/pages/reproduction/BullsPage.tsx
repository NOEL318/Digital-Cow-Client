/**
 * Esta pagina lista los toros del rancho con sus datos reproductivos.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reproduction:bull.internalCode')}</TableHead>
            <TableHead>{t('reproduction:bull.name')}</TableHead>
            <TableHead>{t('reproduction:bull.source')}</TableHead>
            <TableHead>{t('reproduction:bull.registryNumber')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bulls.data?.map(b => (
            <TableRow key={b.id}>
              <TableCell>{b.internalCode}</TableCell>
              <TableCell>{b.name}</TableCell>
              <TableCell>
                <Badge tone={b.source === 'OWN' ? 'success' : 'neutral'}>
                  {t(`reproduction:bull.${b.source}`)}
                </Badge>
              </TableCell>
              <TableCell>{b.registryNumber ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
