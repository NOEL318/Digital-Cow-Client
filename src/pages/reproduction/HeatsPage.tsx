/**
 * Esta pagina lista los celos detectados en las hembras del rancho.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useHeats, useCreateHeat } from '@/features/reproduction/heats/api';
import { HeatForm } from '@/features/reproduction/heats/components/HeatForm';

/** Pagina de listado de celos. */
export default function HeatsPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const heats = useHeats();
  const create = useCreateHeat();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:heat.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:heat.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('reproduction:heat.new')}</DialogTitle></DialogHeader>
            <HeatForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('reproduction:heat.animal')}</th>
            <th className="p-2 text-left">{t('reproduction:heat.detectedAt')}</th>
            <th className="p-2 text-left">{t('reproduction:heat.detectionMethod')}</th>
            <th className="p-2 text-left">{t('reproduction:heat.intensity')}</th>
          </tr>
        </thead>
        <tbody>
          {heats.data?.map(h => (
            <tr key={h.id} className="border-t">
              <td className="p-2">#{h.animalId}</td>
              <td className="p-2">{h.detectedAt}</td>
              <td className="p-2">{h.detectionMethod ? t(`reproduction:heat.method.${h.detectionMethod}`) : '-'}</td>
              <td className="p-2">{h.intensity ? t(`reproduction:heat.intensityValue.${h.intensity}`) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
