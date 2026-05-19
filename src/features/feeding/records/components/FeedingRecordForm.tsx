/**
 * Este componente contiene el formulario para crear o editar registros del modulo feeding/records.
 */
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRanches, useLots } from '@/features/ranches/api';
import { useFeedItems } from '@/features/feeding/items/api';
import { localizedName } from '@/lib/catalog';
import { feedingRecordCreateSchema, type FeedingRecordCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<FeedingRecordCreateInput>;
  onSubmit: (data: FeedingRecordCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para registrar consumo real de alimento por lote.
 * Si el insumo seleccionado tiene unitCost, calcula y muestra costo estimado
 * (el backend recalcula si no se envia explicitamente).
 */
export function FeedingRecordForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['feeding', 'common']);
  const locale = i18n.language;
  const [ranchId, setRanchId] = useState<number | undefined>(undefined);
  const ranches = useRanches();
  const lots = useLots(ranchId);
  const feedItems = useFeedItems();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FeedingRecordCreateInput>({
    resolver: zodResolver(feedingRecordCreateSchema),
    defaultValues
  });

  const feedItemId = watch('feedItemId');
  const totalKg = watch('totalKg');
  const selected = feedItems.data?.find(f => f.id === Number(feedItemId));
  const estimated = selected?.unitCost && totalKg
    ? (Number(selected.unitCost) * Number(totalKg)).toFixed(2)
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>{t('feeding:plan.ranch')}</Label>
        <select
          value={ranchId ?? ''}
          onChange={e => setRanchId(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {ranches.data?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="lotId">{t('feeding:record.lot')}</Label>
        <select
          id="lotId"
          {...register('lotId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
          disabled={!ranchId}
        >
          <option value="">--</option>
          {lots.data?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        {errors.lotId && <p className="text-destructive text-sm">{errors.lotId.message}</p>}
      </div>
      <div>
        <Label htmlFor="feedItemId">{t('feeding:record.feedItem')}</Label>
        <select
          id="feedItemId"
          {...register('feedItemId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {feedItems.data?.map(f => (
            <option key={f.id} value={f.id}>{localizedName(f, locale)}</option>
          ))}
        </select>
        {errors.feedItemId && <p className="text-destructive text-sm">{errors.feedItemId.message}</p>}
      </div>
      <div>
        <Label htmlFor="consumedAt">{t('feeding:record.consumedAt')}</Label>
        <Input id="consumedAt" type="date" {...register('consumedAt')} />
      </div>
      <div>
        <Label htmlFor="totalKg">{t('feeding:record.totalKg')}</Label>
        <Input id="totalKg" type="number" step="0.01" {...register('totalKg', { valueAsNumber: true })} />
        {errors.totalKg && <p className="text-destructive text-sm">{errors.totalKg.message}</p>}
      </div>
      <div>
        <Label htmlFor="cost">{t('feeding:record.cost')}</Label>
        <Input id="cost" type="number" step="0.01" {...register('cost', { valueAsNumber: true })} />
        {estimated && <p className="text-xs text-muted-foreground mt-1">{estimated}</p>}
      </div>
      <div>
        <Label htmlFor="notes">{t('feeding:record.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
