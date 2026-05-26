/**
 * Esta pagina lista los partos registrados con sus resultados.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useCalvings, useCreateCalving } from '@/features/reproduction/calvings/api';
import { CalvingForm } from '@/features/reproduction/calvings/components/CalvingForm';
import type { CalvingOutcome } from '@/features/reproduction/calvings/types';

function outcomeTone(outcome: CalvingOutcome): 'success' | 'danger' | 'warning' | 'neutral' {
  if (outcome === 'LIVE') return 'success';
  if (outcome === 'TWIN_LIVE') return 'success';
  if (outcome === 'STILLBORN' || outcome === 'TWIN_STILLBORN') return 'danger';
  return 'warning';
}

/** Pagina de listado de partos. */
export default function CalvingsPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const calvings = useCalvings();
  const create = useCreateCalving();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:calving.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:calving.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('reproduction:calving.new')}</DialogTitle></DialogHeader>
            <CalvingForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reproduction:calving.calvedAt')}</TableHead>
            <TableHead>{t('reproduction:calving.animal')}</TableHead>
            <TableHead>{t('reproduction:calving.ease')}</TableHead>
            <TableHead>{t('reproduction:calving.outcome')}</TableHead>
            <TableHead>{t('reproduction:calving.calfSex')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calvings.data?.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.calvedAt}</TableCell>
              <TableCell>{c.animalId}</TableCell>
              <TableCell>{t(`reproduction:calving.easeValue.${c.ease}`)}</TableCell>
              <TableCell>
                <Badge tone={outcomeTone(c.outcome)}>
                  {t(`reproduction:calving.outcomeValue.${c.outcome}`)}
                </Badge>
              </TableCell>
              <TableCell>{c.calfSex ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
