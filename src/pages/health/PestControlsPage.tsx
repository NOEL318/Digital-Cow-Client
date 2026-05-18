import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreatePestControl, usePestControls } from '@/features/health/pestControls/api';
import { PestControlForm } from '@/features/health/pestControls/components/PestControlForm';
import { usePests } from '@/features/catalog/api/pests';
import { localizedName } from '@/lib/catalog';

/**
 * Pagina de listado y creacion de controles de plagas.
 */
export default function PestControlsPage() {
  const { t } = useTranslation(['health', 'common']);
  const [open, setOpen] = useState(false);
  const list = usePestControls();
  const pests = usePests();
  const create = useCreatePestControl();
  const locale = i18n.language;

  const pestName = (id: number) => {
    const p = pests.data?.find(x => x.id === id);
    return p ? localizedName(p, locale) : '-';
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('health:pest.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('health:pest.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('health:pest.new')}</DialogTitle></DialogHeader>
            <PestControlForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('health:pest.appliedAt')}</th>
            <th className="p-2 text-left">{t('health:pest.pest')}</th>
            <th className="p-2 text-left">{t('health:pest.product')}</th>
            <th className="p-2 text-left">{t('health:pest.nextApplication')}</th>
          </tr>
        </thead>
        <tbody>
          {list.data?.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.appliedAt}</td>
              <td className="p-2">{pestName(p.pestId)}</td>
              <td className="p-2">{p.productUsed}</td>
              <td className="p-2">{p.nextApplicationAt ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
