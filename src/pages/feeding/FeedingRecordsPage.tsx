/**
 * Esta pagina lista los registros de consumo de alimento por lote y fecha.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { localizedName } from '@/lib/catalog';
import { useFeedingRecords, useCreateFeedingRecord } from '@/features/feeding/records/api';
import { useFeedItems } from '@/features/feeding/items/api';
import { FeedingRecordForm } from '@/features/feeding/records/components/FeedingRecordForm';

/** Pagina de listado de registros de consumo de alimento. */
export default function FeedingRecordsPage() {
  const { t } = useTranslation(['feeding', 'common']);
  const locale = i18n.language;
  const records = useFeedingRecords();
  const items = useFeedItems();
  const create = useCreateFeedingRecord();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('feeding:record.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('feeding:record.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('feeding:record.new')}</DialogTitle></DialogHeader>
            <FeedingRecordForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('feeding:record.consumedAt')}</th>
            <th className="p-2 text-left">{t('feeding:record.lot')}</th>
            <th className="p-2 text-left">{t('feeding:record.feedItem')}</th>
            <th className="p-2 text-left">{t('feeding:record.totalKg')}</th>
            <th className="p-2 text-left">{t('feeding:record.cost')}</th>
          </tr>
        </thead>
        <tbody>
          {records.data?.map(r => {
            const f = items.data?.find(x => x.id === r.feedItemId);
            return (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.consumedAt}</td>
                <td className="p-2">{r.lotId}</td>
                <td className="p-2">{f ? localizedName(f, locale) : `#${r.feedItemId}`}</td>
                <td className="p-2">{r.totalKg}</td>
                <td className="p-2">{r.cost ?? '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
