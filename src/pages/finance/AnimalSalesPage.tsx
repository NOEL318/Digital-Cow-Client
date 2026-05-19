/**
 * Esta pagina lista las ventas de animales registradas y permite agregar nuevas.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('finance:animalSale.soldAt')}</th>
            <th className="p-2 text-left">{t('finance:animalSale.animal')}</th>
            <th className="p-2 text-left">{t('finance:animalSale.buyer')}</th>
            <th className="p-2 text-right">{t('finance:animalSale.liveWeightKg')}</th>
            <th className="p-2 text-right">{t('finance:animalSale.pricePerKg')}</th>
            <th className="p-2 text-right">{t('finance:animalSale.totalPrice')}</th>
          </tr>
        </thead>
        <tbody>
          {salesRows.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.soldAt}</td>
              <td className="p-2">{animalLabel(s.animalId)}</td>
              <td className="p-2">{s.buyer ?? '-'}</td>
              <td className="p-2 text-right">{s.liveWeightKg ?? '-'}</td>
              <td className="p-2 text-right">{s.pricePerKg ?? '-'}</td>
              <td className="p-2 text-right">{Number(s.totalPrice).toFixed(2)} {s.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
