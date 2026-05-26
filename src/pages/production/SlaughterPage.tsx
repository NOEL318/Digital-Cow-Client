/**
 * Esta pagina lista los resultados de faena registrados para los animales sacrificados.
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
import { useSlaughterResults, useCreateSlaughterResult } from '@/features/production/slaughter/api';
import { SlaughterResultForm } from '@/features/production/slaughter/components/SlaughterResultForm';

/** Pagina de listado de resultados de sacrificio. */
export default function SlaughterPage() {
  const { t } = useTranslation(['production', 'common']);
  const results = useSlaughterResults();
  const create = useCreateSlaughterResult();
  const [open, setOpen] = useState(false);

  /** Tone based on carcass yield percentage (higher = better). */
  function yieldTone(pct: number | null | undefined) {
    if (pct == null) return 'neutral' as const;
    if (pct >= 55) return 'success' as const;
    if (pct >= 45) return 'warning' as const;
    return 'danger' as const;
  }

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('production:slaughter.slaughteredAt')}</TableHead>
            <TableHead>{t('production:slaughter.animal')}</TableHead>
            <TableHead>{t('production:slaughter.liveWeightKg')}</TableHead>
            <TableHead>{t('production:slaughter.carcassWeightKg')}</TableHead>
            <TableHead>{t('production:slaughter.yieldPct')}</TableHead>
            <TableHead>{t('production:slaughter.grade')}</TableHead>
            <TableHead>{t('production:slaughter.buyer')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.data?.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.slaughteredAt}</TableCell>
              <TableCell>{s.animalId}</TableCell>
              <TableCell>{s.liveWeightKg ?? '-'}</TableCell>
              <TableCell>{s.carcassWeightKg ?? '-'}</TableCell>
              <TableCell>
                {s.yieldPct != null ? (
                  <Badge tone={yieldTone(s.yieldPct)}>{s.yieldPct}%</Badge>
                ) : '-'}
              </TableCell>
              <TableCell>{s.grade ?? '-'}</TableCell>
              <TableCell>{s.buyer ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
