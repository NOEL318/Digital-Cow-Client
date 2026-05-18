import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Lock } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { localizedName } from '@/lib/catalog';
import { useFeedItems, useCreateFeedItem } from '@/features/feeding/items/api';
import { FeedItemForm } from '@/features/feeding/items/components/FeedItemForm';

/** Pagina del catalogo de insumos (cuenta + globales con candado). */
export default function FeedItemsPage() {
  const { t } = useTranslation(['feeding', 'common']);
  const locale = i18n.language;
  const items = useFeedItems();
  const create = useCreateFeedItem();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('feeding:item.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('feeding:item.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('feeding:item.new')}</DialogTitle></DialogHeader>
            <FeedItemForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('feeding:item.code')}</th>
            <th className="p-2 text-left">{t('feeding:item.nameEs')}</th>
            <th className="p-2 text-left">{t('feeding:item.category')}</th>
            <th className="p-2 text-left">{t('feeding:item.dryMatterPct')}</th>
            <th className="p-2 text-left">{t('feeding:item.proteinPct')}</th>
            <th className="p-2 text-left">{t('feeding:item.energyMcalKg')}</th>
            <th className="p-2 text-left">{t('feeding:item.unitCost')}</th>
            <th className="p-2 text-left">{t('feeding:item.currency')}</th>
          </tr>
        </thead>
        <tbody>
          {items.data?.map(f => (
            <tr key={f.id} className="border-t">
              <td className="p-2 flex items-center gap-1">
                {f.code}
                {f.accountId === null && <Lock className="h-3 w-3 text-muted-foreground" aria-label={t('feeding:item.global')} />}
              </td>
              <td className="p-2">{localizedName(f, locale)}</td>
              <td className="p-2">{t(`feeding:item.categoryValue.${f.category}`)}</td>
              <td className="p-2">{f.dryMatterPct ?? '-'}</td>
              <td className="p-2">{f.proteinPct ?? '-'}</td>
              <td className="p-2">{f.energyMcalKg ?? '-'}</td>
              <td className="p-2">{f.unitCost ?? '-'}</td>
              <td className="p-2">{f.currency ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
