import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMilkSamples, useCreateMilkSample } from '@/features/production/milkSamples/api';
import { MilkSampleForm } from '@/features/production/milkSamples/components/MilkSampleForm';

/** Pagina de listado de muestras de leche. */
export default function MilkSamplesPage() {
  const { t } = useTranslation(['production', 'common']);
  const samples = useMilkSamples();
  const create = useCreateMilkSample();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('production:milkSample.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('production:milkSample.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('production:milkSample.new')}</DialogTitle></DialogHeader>
            <MilkSampleForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('production:milkSample.sampledAt')}</th>
            <th className="p-2 text-left">{t('production:milkSample.animal')}</th>
            <th className="p-2 text-left">{t('production:milkSample.scc')}</th>
            <th className="p-2 text-left">{t('production:milkSample.fatPct')}</th>
            <th className="p-2 text-left">{t('production:milkSample.proteinPct')}</th>
            <th className="p-2 text-left">{t('production:milkSample.lactosePct')}</th>
          </tr>
        </thead>
        <tbody>
          {samples.data?.map(s => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.sampledAt}</td>
              <td className="p-2">{s.animalId}</td>
              <td className="p-2">{s.sccCellsPerMl ?? '-'}</td>
              <td className="p-2">{s.fatPct ?? '-'}</td>
              <td className="p-2">{s.proteinPct ?? '-'}</td>
              <td className="p-2">{s.lactosePct ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
