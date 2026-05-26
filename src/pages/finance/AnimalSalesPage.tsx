/**
 * Esta pagina lista las ventas de animales registradas y permite agregar nuevas.
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
import { useAnimalSales, useCreateAnimalSale } from '@/features/finance/animalSales/api';
import type { AnimalSale } from '@/features/finance/animalSales/types';
import { AnimalSaleForm } from '@/features/finance/animalSales/components/AnimalSaleForm';
import { useAnimals } from '@/features/animals/api';
import type { AnimalListItem } from '@/features/animals/types';

/** Pagina de listado y registro de ventas de animal. */
export default function AnimalSalesPage() {
  const { t } = useTranslation(['finance', 'common']);
  const [open, setOpen] = useState(false);
  const sales = useAnimalSales();
  const create = useCreateAnimalSale();
  const animals = useAnimals({ size: 500 });

  const salesRows = toArray<AnimalSale>(sales.data);
  const animalsList = toArray<AnimalListItem>(animals.data);
  const animalLabel = (id: number) => {
    const a = animalsList.find(x => x.id === id);
    return a ? `${a.internalTag}${a.name ? ` - ${a.name}` : ''}` : `#${id}`;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('finance:animalSale.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('finance:animalSale.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('finance:animalSale.new')}</DialogTitle></DialogHeader>
            <AnimalSaleForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('finance:animalSale.soldAt')}</TableHead>
            <TableHead>{t('finance:animalSale.animal')}</TableHead>
            <TableHead>{t('finance:animalSale.buyer')}</TableHead>
            <TableHead className="text-right">{t('finance:animalSale.liveWeightKg')}</TableHead>
            <TableHead className="text-right">{t('finance:animalSale.pricePerKg')}</TableHead>
            <TableHead className="text-right">{t('finance:animalSale.totalPrice')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesRows.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.soldAt}</TableCell>
              <TableCell>{animalLabel(s.animalId)}</TableCell>
              <TableCell>{s.buyer ?? '-'}</TableCell>
              <TableCell className="text-right">{s.liveWeightKg ?? '-'}</TableCell>
              <TableCell className="text-right">{s.pricePerKg ?? '-'}</TableCell>
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
