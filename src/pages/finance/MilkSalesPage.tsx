/**
 * Esta pagina lista las ventas de leche registradas y permite registrar nuevas.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { toArray } from '@/lib/page';
import { useMilkSales, useCreateMilkSale } from '@/features/finance/milkSales/api';
import type { MilkSale } from '@/features/finance/milkSales/types';
import { MilkSaleForm } from '@/features/finance/milkSales/components/MilkSaleForm';
import { useRanches } from '@/features/ranches/api';

/** Pagina de listado y registro de ventas de leche. */
export default function MilkSalesPage() {
  const { t } = useTranslation(['finance', 'common']);
  const [open, setOpen] = useState(false);
  const sales = useMilkSales();
  const create = useCreateMilkSale();
  const ranches = useRanches();

  const ranchName = (id?: number | null) => {
    if (id == null) return '-';
    return ranches.data?.find(r => r.id === id)?.name ?? `#${id}`;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('finance:milkSale.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('finance:milkSale.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('finance:milkSale.new')}</DialogTitle></DialogHeader>
            <MilkSaleForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('finance:milkSale.saleDate')}</TableHead>
            <TableHead>{t('finance:milkSale.ranch')}</TableHead>
            <TableHead>{t('finance:milkSale.buyer')}</TableHead>
            <TableHead className="text-right">{t('finance:milkSale.totalLiters')}</TableHead>
            <TableHead className="text-right">{t('finance:milkSale.pricePerLiter')}</TableHead>
            <TableHead className="text-right">{t('finance:milkSale.totalPrice')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {toArray<MilkSale>(sales.data).map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.saleDate}</TableCell>
              <TableCell>{ranchName(s.ranchId)}</TableCell>
              <TableCell>{s.buyer ?? '-'}</TableCell>
              <TableCell className="text-right">{Number(s.totalLiters).toFixed(2)}</TableCell>
              <TableCell className="text-right">{Number(s.pricePerLiter).toFixed(4)}</TableCell>
              <TableCell className="text-right font-semibold text-green-700 dark:text-green-400">
                {Number(s.totalPrice).toFixed(2)} {s.currency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
