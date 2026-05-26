/**
 * Este componente contiene el formulario para crear o editar registros del modulo health/treatments.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { useMedications } from '@/features/catalog/api/medications';
import { localizedName } from '@/lib/catalog';
import { treatmentCreateSchema, type TreatmentCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<TreatmentCreateInput>;
  onSubmit: (data: TreatmentCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para tratamiento. Calcula y muestra los withdrawals en tiempo real
 * a partir de la medicacion catalogada (informativo; el backend recalcula).
 */
export function TreatmentForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['health', 'common']);
  const locale = i18n.language;
  const animals = useAnimals({ size: 200 });
  const medications = useMedications();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TreatmentCreateInput>({
    resolver: zodResolver(treatmentCreateSchema),
    defaultValues
  });

  const medicationId = watch('medicationId');
  const startedAt = watch('startedAt');
  const med = medications.data?.find(m => m.id === Number(medicationId));
  const milkUntil =
    med && startedAt && med.withdrawalMilkDays > 0
      ? new Date(new Date(startedAt).getTime() + med.withdrawalMilkDays * 86400000)
          .toISOString()
          .slice(0, 10)
      : null;
  const meatUntil =
    med && startedAt && med.withdrawalMeatDays > 0
      ? new Date(new Date(startedAt).getTime() + med.withdrawalMeatDays * 86400000)
          .toISOString()
          .slice(0, 10)
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('health:animal')}</Label>
        <select
          id="animalId"
          {...register('animalId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {animals.data?.content.map(a => (
            <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
          ))}
        </select>
        {errors.animalId && <p className="text-destructive text-sm">{errors.animalId.message}</p>}
      </div>
      <div>
        <Label htmlFor="medicationId">{t('health:treatment.medication')}</Label>
        <select
          id="medicationId"
          {...register('medicationId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {medications.data?.map(m => (
            <option key={m.id} value={m.id}>{localizedName(m, locale)}</option>
          ))}
        </select>
        {errors.medicationId && <p className="text-destructive text-sm">{errors.medicationId.message}</p>}
      </div>
      <div>
        <Label htmlFor="startedAt">{t('health:treatment.startedAt')}</Label>
        <Input id="startedAt" type="date" {...register('startedAt')} />
      </div>
      <div>
        <Label htmlFor="endedAt">{t('health:treatment.endedAt')}</Label>
        <Input id="endedAt" type="date" {...register('endedAt')} />
      </div>
      <div>
        <Label htmlFor="dose">{t('health:treatment.dose')}</Label>
        <Input id="dose" {...register('dose')} />
      </div>
      <div>
        <Label htmlFor="dosesCount">{t('health:treatment.dosesCount')}</Label>
        <Input
          id="dosesCount"
          type="number"
          {...register('dosesCount', { valueAsNumber: true })}
        />
      </div>
      <div>
        <Label htmlFor="route">{t('health:treatment.route')}</Label>
        <select
          id="route"
          {...register('route')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {(['IM', 'SC', 'IV', 'ORAL', 'TOPICAL', 'INTRAMAMMARY'] as const).map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="cost">{t('health:treatment.cost')}</Label>
        <Input
          id="cost"
          type="number"
          step="0.01"
          {...register('cost', { valueAsNumber: true })}
        />
      </div>
      <div>
        <Label htmlFor="prescribedBy">{t('health:treatment.prescribedBy')}</Label>
        <Input id="prescribedBy" {...register('prescribedBy')} />
      </div>
      {med && (milkUntil || meatUntil) && (
        <div className="text-sm text-muted-foreground border-l-2 pl-3">
          {milkUntil && <p>{t('health:treatment.withdrawalMilk')}: {milkUntil}</p>}
          {meatUntil && <p>{t('health:treatment.withdrawalMeat')}: {meatUntil}</p>}
        </div>
      )}
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
