/**
 * Esta pagina lista los chequeos de prenez realizados y sus resultados.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { usePregnancyChecks, useCreatePregnancyCheck } from '@/features/reproduction/pregnancyChecks/api';
import { PregnancyCheckForm } from '@/features/reproduction/pregnancyChecks/components/PregnancyCheckForm';
import type { PregnancyResult } from '@/features/reproduction/pregnancyChecks/types';

function resultTone(result: PregnancyResult): 'success' | 'danger' | 'warning' {
  if (result === 'POSITIVE') return 'success';
  if (result === 'NEGATIVE') return 'danger';
  return 'warning';
}

/** Pagina de listado de diagnosticos de gestacion. */
export default function PregnancyChecksPage() {
  const { t } = useTranslation(['reproduction', 'common']);
  const checks = usePregnancyChecks();
  const create = useCreatePregnancyCheck();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reproduction:pregnancy.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('reproduction:pregnancy.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('reproduction:pregnancy.new')}</DialogTitle></DialogHeader>
            <PregnancyCheckForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('reproduction:pregnancy.animal')}</TableHead>
            <TableHead>{t('reproduction:pregnancy.checkedAt')}</TableHead>
            <TableHead>{t('reproduction:pregnancy.method')}</TableHead>
            <TableHead>{t('reproduction:pregnancy.result')}</TableHead>
            <TableHead>{t('reproduction:pregnancy.estimatedCalvingDate')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checks.data?.map(c => (
            <TableRow key={c.id}>
              <TableCell>#{c.animalId}</TableCell>
              <TableCell>{c.checkedAt}</TableCell>
              <TableCell>{c.method ? t(`reproduction:pregnancy.methodValue.${c.method}`) : '-'}</TableCell>
              <TableCell>
                <Badge tone={resultTone(c.result)}>
                  {t(`reproduction:pregnancy.resultValue.${c.result}`)}
                </Badge>
              </TableCell>
              <TableCell>{c.estimatedCalvingDate ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
