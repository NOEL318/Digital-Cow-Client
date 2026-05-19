/**
 * Este componente contiene el formulario para crear o editar registros del modulo reproduction/pregnancyChecks.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { useServiceEvents } from '@/features/reproduction/services/api';
import { pregnancyCheckCreateSchema, type PregnancyCheckCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<PregnancyCheckCreateInput>;
  onSubmit: (data: PregnancyCheckCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para registrar un diagnostico de gestacion.
 * Muestra fecha estimada de parto = checked_at + (283 - estimatedGestationDays) cuando POSITIVE.
 * Filtra servicios por animal seleccionado.
 */
export function PregnancyCheckForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['reproduction', 'common']);
  const females = useAnimals({ sex: 'FEMALE', size: 200 });
  const services = useServiceEvents();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PregnancyCheckCreateInput>({
    resolver: zodResolver(pregnancyCheckCreateSchema),
    defaultValues: { result: 'POSITIVE', ...defaultValues }
  });

  const animalId = watch('animalId');
  const result = watch('result');
  const checkedAt = watch('checkedAt');
  const gestationDays = watch('estimatedGestationDays');

  const filteredServices = services.data?.filter(s => Number(animalId) === s.animalId) ?? [];

  const estimatedCalving = (result === 'POSITIVE' && checkedAt && gestationDays)
    ? new Date(new Date(checkedAt).getTime() + (283 - Number(gestationDays)) * 86400000).toISOString().slice(0, 10)
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('reproduction:pregnancy.animal')}</Label>
        <select
          id="animalId"
          {...register('animalId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {females.data?.content.map(a => (
            <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
          ))}
        </select>
        {errors.animalId && <p className="text-destructive text-sm">{errors.animalId.message}</p>}
      </div>
      <div>
        <Label htmlFor="serviceId">{t('reproduction:pregnancy.service')}</Label>
        <select
          id="serviceId"
          {...register('serviceId', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {filteredServices.map(s => (
            <option key={s.id} value={s.id}>{s.serviceDate} - {t(`reproduction:service.type.${s.serviceType}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="checkedAt">{t('reproduction:pregnancy.checkedAt')}</Label>
        <Input id="checkedAt" type="date" {...register('checkedAt')} />
      </div>
      <div>
        <Label htmlFor="method">{t('reproduction:pregnancy.method')}</Label>
        <select
          id="method"
          {...register('method')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {(['PALPATION', 'ULTRASOUND', 'BLOOD_TEST', 'MILK_TEST'] as const).map(m => (
            <option key={m} value={m}>{t(`reproduction:pregnancy.methodValue.${m}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>{t('reproduction:pregnancy.result')}</Label>
        <div className="flex gap-4 mt-2">
          {(['POSITIVE', 'NEGATIVE', 'DOUBTFUL'] as const).map(r => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input type="radio" value={r} {...register('result')} />
              {t(`reproduction:pregnancy.resultValue.${r}`)}
            </label>
          ))}
        </div>
      </div>
      {result === 'POSITIVE' && (
        <div>
          <Label htmlFor="estimatedGestationDays">{t('reproduction:pregnancy.estimatedGestationDays')}</Label>
          <Input
            id="estimatedGestationDays"
            type="number"
            {...register('estimatedGestationDays', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
          />
        </div>
      )}
      <div>
        <Label htmlFor="notes">{t('reproduction:pregnancy.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      {estimatedCalving && (
        <p className="text-sm text-muted-foreground">
          {t('reproduction:pregnancy.estimatedCalvingDate')}: {estimatedCalving}
        </p>
      )}
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
