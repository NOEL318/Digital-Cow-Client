/**
 * Esta pagina lista las muestras de leche tomadas con sus resultados de laboratorio.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMilkSamples, useCreateMilkSample } from '@/features/production/milkSamples/api';
import { MilkSampleForm } from '@/features/production/milkSamples/components/MilkSampleForm';

/** Pagina de listado de muestras de leche. */
export default function MilkSamplesPage() {
  const { t } = useTranslation(['production', 'common']);
  const samples = useMilkSamples();
  const create = useCreateMilkSample();
  const [open, setOpen] = useState(false);

  /** Returns a semantic tone for somatic cell count (lower is better). */
  function sccTone(scc: number | null | undefined) {
    if (scc == null) return 'neutral' as const;
    if (scc < 200_000) return 'success' as const;
    if (scc < 400_000) return 'warning' as const;
    return 'danger' as const;
  }

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('production:milkSample.sampledAt')}</TableHead>
            <TableHead>{t('production:milkSample.animal')}</TableHead>
            <TableHead>{t('production:milkSample.scc')}</TableHead>
            <TableHead>{t('production:milkSample.fatPct')}</TableHead>
            <TableHead>{t('production:milkSample.proteinPct')}</TableHead>
            <TableHead>{t('production:milkSample.lactosePct')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {samples.data?.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.sampledAt}</TableCell>
              <TableCell>{s.animalId}</TableCell>
              <TableCell>
                {s.sccCellsPerMl != null ? (
                  <Badge tone={sccTone(s.sccCellsPerMl)}>{s.sccCellsPerMl.toLocaleString()}</Badge>
                ) : '-'}
              </TableCell>
              <TableCell>{s.fatPct ?? '-'}</TableCell>
              <TableCell>{s.proteinPct ?? '-'}</TableCell>
              <TableCell>{s.lactosePct ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
