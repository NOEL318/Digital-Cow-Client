/**
 * Esta pagina lista los celos detectados en las hembras del rancho.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useHeats, useCreateHeat } from '@/features/reproduction/heats/api';
import { HeatForm } from '@/features/reproduction/heats/components/HeatForm';
import type { HeatIntensity } from '@/features/reproduction/heats/types';

function intensityTone(intensity: HeatIntensity): 'pink' | 'warning' | 'neutral' {
  if (intensity === 'STRONG') return 'pink';
  if (intensity === 'MODERATE') return 'warning';
  return 'neutral';
}

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reproduction:heat.animal')}</TableHead>
            <TableHead>{t('reproduction:heat.detectedAt')}</TableHead>
            <TableHead>{t('reproduction:heat.detectionMethod')}</TableHead>
            <TableHead>{t('reproduction:heat.intensity')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {heats.data?.map(h => (
            <TableRow key={h.id}>
              <TableCell>#{h.animalId}</TableCell>
              <TableCell>{h.detectedAt}</TableCell>
              <TableCell>{h.detectionMethod ? t(`reproduction:heat.method.${h.detectionMethod}`) : '-'}</TableCell>
              <TableCell>
                {h.intensity
                  ? <Badge tone={intensityTone(h.intensity)}>{t(`reproduction:heat.intensityValue.${h.intensity}`)}</Badge>
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
