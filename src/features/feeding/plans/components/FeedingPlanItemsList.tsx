/**
 * Este componente lista registros del modulo feeding/plans con paginacion y acciones rapidas.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { localizedName } from '@/lib/catalog';
import { useFeedItems } from '@/features/feeding/items/api';
import { useAddPlanItem, useRemovePlanItem } from '../api';
import type { FeedingPlanItem } from '../types';

interface Props {
  planId: number;
  items: FeedingPlanItem[];
}

/** Lista editable de insumos del plan: agregar, mostrar y eliminar. */
export function FeedingPlanItemsList({ planId, items }: Props) {
  const { t } = useTranslation(['feeding', 'common']);
  const locale = i18n.language;
  const feedItems = useFeedItems();
  const add = useAddPlanItem(planId);
  const remove = useRemovePlanItem(planId);
  const [adding, setAdding] = useState(false);
  const [feedItemId, setFeedItemId] = useState<number | ''>('');
  const [kg, setKg] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const submitNew = async () => {
    if (!feedItemId || !kg) return;
    await add.mutateAsync({
      feedItemId: Number(feedItemId),
      kgPerHeadDay: Number(kg),
      notes: notes || undefined
    });
    setFeedItemId('');
    setKg('');
    setNotes('');
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{t('feeding:plan.items')}</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('feeding:plan.feedItem')}</TableHead>
            <TableHead>{t('feeding:plan.kgPerHeadDay')}</TableHead>
            <TableHead>{t('feeding:plan.notes')}</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(it => {
            const f = feedItems.data?.find(x => x.id === it.feedItemId);
            return (
              <TableRow key={it.id}>
                <TableCell>{f ? localizedName(f, locale) : `#${it.feedItemId}`}</TableCell>
                <TableCell>{it.kgPerHeadDay}</TableCell>
                <TableCell>{it.notes ?? '-'}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => remove.mutate(it.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {adding ? (
        <div className="border rounded p-3 space-y-2">
          <div>
            <Label>{t('feeding:plan.feedItem')}</Label>
            <select
              value={feedItemId}
              onChange={e => setFeedItemId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border rounded h-10 px-2 bg-background"
            >
              <option value="">--</option>
              {feedItems.data?.map(f => (
                <option key={f.id} value={f.id}>{localizedName(f, locale)}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>{t('feeding:plan.kgPerHeadDay')}</Label>
            <Input
              type="number"
              step="0.01"
              value={kg}
              onChange={e => setKg(e.target.value ? Number(e.target.value) : '')}
            />
          </div>
          <div>
            <Label>{t('feeding:plan.notes')}</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={submitNew} disabled={add.isPending}>{t('common:actions.save')}</Button>
            <Button variant="outline" onClick={() => setAdding(false)}>{t('common:actions.cancel')}</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />{t('feeding:plan.addItem')}
        </Button>
      )}
    </div>
  );
}
