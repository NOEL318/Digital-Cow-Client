/**
 * Esta pagina muestra el catalogo de items alimenticios disponibles con su informacion nutricional.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Lock } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('feeding:item.code')}</TableHead>
            <TableHead>{t('feeding:item.nameEs')}</TableHead>
            <TableHead>{t('feeding:item.category')}</TableHead>
            <TableHead>{t('feeding:item.dryMatterPct')}</TableHead>
            <TableHead>{t('feeding:item.proteinPct')}</TableHead>
            <TableHead>{t('feeding:item.energyMcalKg')}</TableHead>
            <TableHead>{t('feeding:item.unitCost')}</TableHead>
            <TableHead>{t('feeding:item.currency')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.data?.map(f => (
            <TableRow key={f.id}>
              <TableCell className="flex items-center gap-1">
                {f.code}
                {f.accountId === null && (
                  <Lock className="h-3 w-3 text-muted-foreground" aria-label={t('feeding:item.global')} />
                )}
              </TableCell>
              <TableCell>{localizedName(f, locale)}</TableCell>
              <TableCell>
                <Badge tone="neutral">{t(`feeding:item.categoryValue.${f.category}`)}</Badge>
              </TableCell>
              <TableCell>{f.dryMatterPct ?? '-'}</TableCell>
              <TableCell>{f.proteinPct ?? '-'}</TableCell>
              <TableCell>{f.energyMcalKg ?? '-'}</TableCell>
              <TableCell>{f.unitCost ?? '-'}</TableCell>
              <TableCell>{f.currency ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
