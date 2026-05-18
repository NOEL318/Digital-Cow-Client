import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('reproduction:weaning.weanedAt')}</th>
            <th className="p-2 text-left">{t('reproduction:weaning.animal')}</th>
            <th className="p-2 text-right">{t('reproduction:weaning.weightKg')}</th>
          </tr>
        </thead>
        <tbody>
          {weanings.data?.map(w => (
            <tr key={w.id} className="border-t">
              <td className="p-2">{w.weanedAt}</td>
              <td className="p-2">{w.animalId}</td>
              <td className="p-2 text-right">{w.weightKg ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
