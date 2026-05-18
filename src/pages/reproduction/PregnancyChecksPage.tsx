import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePregnancyChecks, useCreatePregnancyCheck } from '@/features/reproduction/pregnancyChecks/api';
import { PregnancyCheckForm } from '@/features/reproduction/pregnancyChecks/components/PregnancyCheckForm';

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
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('reproduction:pregnancy.animal')}</th>
            <th className="p-2 text-left">{t('reproduction:pregnancy.checkedAt')}</th>
            <th className="p-2 text-left">{t('reproduction:pregnancy.method')}</th>
            <th className="p-2 text-left">{t('reproduction:pregnancy.result')}</th>
            <th className="p-2 text-left">{t('reproduction:pregnancy.estimatedCalvingDate')}</th>
          </tr>
        </thead>
        <tbody>
          {checks.data?.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-2">#{c.animalId}</td>
              <td className="p-2">{c.checkedAt}</td>
              <td className="p-2">{c.method ? t(`reproduction:pregnancy.methodValue.${c.method}`) : '-'}</td>
              <td className="p-2">{t(`reproduction:pregnancy.resultValue.${c.result}`)}</td>
              <td className="p-2">{c.estimatedCalvingDate ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
