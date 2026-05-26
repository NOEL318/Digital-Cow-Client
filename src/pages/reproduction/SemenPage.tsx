/**
 * Esta pagina lista las pajuelas de semen disponibles con su stock.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reproduction:semen.bull')}</TableHead>
            <TableHead>{t('reproduction:semen.batchNumber')}</TableHead>
            <TableHead className="text-right">{t('reproduction:semen.availableQuantity')}</TableHead>
            <TableHead className="text-right">{t('reproduction:semen.totalQuantity')}</TableHead>
            <TableHead>{t('reproduction:semen.expiresAt')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {straws.data?.map(s => (
            <TableRow key={s.id}>
              <TableCell>{bullName(s.bullId)}</TableCell>
              <TableCell>{s.batchNumber ?? '-'}</TableCell>
              <TableCell className="text-right">
                <Badge tone={s.availableQuantity === 0 ? 'danger' : s.availableQuantity < 5 ? 'warning' : 'success'}>
                  {s.availableQuantity}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{s.totalQuantity}</TableCell>
              <TableCell>{s.expiresAt ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
