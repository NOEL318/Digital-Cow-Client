import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSlaughterResults, useCreateSlaughterResult } from '@/features/production/slaughter/api';
import { SlaughterResultForm } from '@/features/production/slaughter/components/SlaughterResultForm';

/** Pagina de listado de resultados de sacrificio. */
export default function SlaughterPage() {
  const { t } = useTranslation(['production', 'common']);
  const results = useSlaughterResults();
  const create = useCreateSlaughterResult();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('production:slaughter.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('production:slaughter.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('production:slaughter.new')}</DialogTitle></DialogHeader>
            <SlaughterResultForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('production:slaughter.slaughteredAt')}</th>
            <th className="p-2 text-left">{t('production:slaughter.animal')}</th>
            <th className="p-2 text-left">{t('production:slaughter.liveWeightKg')}</th>
            <th className="p-2 text-left">{t('production:slaughter.carcassWeightKg')}</th>
            <th className="p-2 text-left">{t('production:slaughter.yieldPct')}</th>
            <th className="p-2 text-left">{t('production:slaughter.grade')}</th>
            <th className="p-2 text-left">{t('production:slaughter.buyer')}</th>
          </tr>
        </thead>
        <tbody>
          {results.data?.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.slaughteredAt}</td>
              <td className="p-2">{s.animalId}</td>
              <td className="p-2">{s.liveWeightKg ?? '-'}</td>
              <td className="p-2">{s.carcassWeightKg ?? '-'}</td>
              <td className="p-2">{s.yieldPct ?? '-'}</td>
              <td className="p-2">{s.grade ?? '-'}</td>
              <td className="p-2">{s.buyer ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
