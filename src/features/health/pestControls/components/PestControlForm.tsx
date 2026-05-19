/**
 * Este componente contiene el formulario para crear o editar registros del modulo health/pestControls.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRanches, useLots } from '@/features/ranches/api';
import { usePests } from '@/features/catalog/api/pests';
import { localizedName } from '@/lib/catalog';
import { pestControlCreateSchema, type PestControlCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<PestControlCreateInput>;
  onSubmit: (data: PestControlCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para registrar un control de plagas (a rancho o a lote).
 */
export function PestControlForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['health', 'common', 'animals']);
  const locale = i18n.language;
  const ranches = useRanches();
  const [ranchId, setRanchId] = useState<number | undefined>(undefined);
  const lots = useLots(ranchId);
  const pests = usePests();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PestControlCreateInput>({
    resolver: zodResolver(pestControlCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="ranchId">{t('animals:fields.ranch')}</Label>
        <select
          id="ranchId"
          value={ranchId ?? ''}
          onChange={e => {
            const v = e.target.value ? Number(e.target.value) : undefined;
            setRanchId(v);
            setValue('ranchId', v);
            setValue('lotId', undefined);
          }}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {ranches.data?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        {errors.ranchId && <p className="text-destructive text-sm">{errors.ranchId.message}</p>}
      </div>
      <div>
        <Label htmlFor="lotId">{t('health:vaccination.lot')}</Label>
        <select
          id="lotId"
          {...register('lotId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
          disabled={!ranchId}
        >
          <option value="">--</option>
          {lots.data?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="pestId">{t('health:pest.pest')}</Label>
        <select
          id="pestId"
          {...register('pestId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {pests.data?.map(p => (
            <option key={p.id} value={p.id}>{localizedName(p, locale)}</option>
          ))}
        </select>
        {errors.pestId && <p className="text-destructive text-sm">{errors.pestId.message}</p>}
      </div>
      <div>
        <Label htmlFor="productUsed">{t('health:pest.product')}</Label>
        <Input id="productUsed" {...register('productUsed')} />
      </div>
      <div>
        <Label htmlFor="dose">Dose</Label>
        <Input id="dose" {...register('dose')} />
      </div>
      <div>
        <Label htmlFor="appliedAt">{t('health:pest.appliedAt')}</Label>
        <Input id="appliedAt" type="date" {...register('appliedAt')} />
      </div>
      <div>
        <Label htmlFor="nextApplicationAt">{t('health:pest.nextApplication')}</Label>
        <Input id="nextApplicationAt" type="date" {...register('nextApplicationAt')} />
      </div>
      <div>
        <Label htmlFor="cost">Cost</Label>
        <Input
          id="cost"
          type="number"
          step="0.01"
          {...register('cost', { valueAsNumber: true })}
        />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
