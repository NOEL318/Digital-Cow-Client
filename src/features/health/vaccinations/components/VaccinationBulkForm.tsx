/**
 * Este componente contiene el formulario para crear o editar registros del modulo health/vaccinations.
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
import { useVaccines } from '@/features/catalog/api/vaccines';
import { localizedName } from '@/lib/catalog';
import { vaccinationBulkCreateSchema, type VaccinationBulkCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<VaccinationBulkCreateInput>;
  onSubmit: (data: VaccinationBulkCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario de vacunacion por lote. El backend expande el POST a una fila por animal activo.
 */
export function VaccinationBulkForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['health', 'common', 'animals']);
  const locale = i18n.language;
  const ranches = useRanches();
  const [ranchId, setRanchId] = useState<number | undefined>(undefined);
  const lots = useLots(ranchId);
  const vaccines = useVaccines();
  const { register, handleSubmit, formState: { errors } } = useForm<VaccinationBulkCreateInput>({
    resolver: zodResolver(vaccinationBulkCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="ranchSelect">{t('animals:fields.ranch')}</Label>
        <select
          id="ranchSelect"
          value={ranchId ?? ''}
          onChange={e => setRanchId(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {ranches.data?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
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
        {errors.lotId && <p className="text-destructive text-sm">{errors.lotId.message}</p>}
      </div>
      <div>
        <Label htmlFor="vaccineId">{t('health:vaccination.vaccine')}</Label>
        <select
          id="vaccineId"
          {...register('vaccineId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {vaccines.data?.map(v => (
            <option key={v.id} value={v.id}>{localizedName(v, locale)}</option>
          ))}
        </select>
        {errors.vaccineId && <p className="text-destructive text-sm">{errors.vaccineId.message}</p>}
      </div>
      <div>
        <Label htmlFor="appliedAt">{t('health:vaccination.appliedAt')}</Label>
        <Input id="appliedAt" type="date" {...register('appliedAt')} />
      </div>
      <div>
        <Label htmlFor="batchNumber">{t('health:vaccination.batch')}</Label>
        <Input id="batchNumber" {...register('batchNumber')} />
      </div>
      <div>
        <Label htmlFor="doseMl">{t('health:vaccination.doseMl')}</Label>
        <Input
          id="doseMl"
          type="number"
          step="0.01"
          {...register('doseMl', { valueAsNumber: true })}
        />
      </div>
      <div>
        <Label htmlFor="route">{t('health:vaccination.route')}</Label>
        <select
          id="route"
          {...register('route')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {(['IM', 'SC', 'ORAL', 'INTRANASAL', 'TOPICAL'] as const).map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="cost">{t('health:vaccination.cost')}</Label>
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
