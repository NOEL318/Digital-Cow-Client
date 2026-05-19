/**
 * Este componente contiene el formulario para crear o editar registros del modulo production/weighings.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { weighingCreateSchema, type WeighingCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<WeighingCreateInput>;
  onSubmit: (data: WeighingCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para registrar un pesaje individual. */
export function WeighingForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['production', 'common']);
  const animals = useAnimals({ size: 200 });
  const { register, handleSubmit, formState: { errors } } = useForm<WeighingCreateInput>({
    resolver: zodResolver(weighingCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('production:weighing.animal')}</Label>
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
        <Label htmlFor="weighedAt">{t('production:weighing.weighedAt')}</Label>
        <Input id="weighedAt" type="date" {...register('weighedAt')} />
        {errors.weighedAt && <p className="text-destructive text-sm">{errors.weighedAt.message}</p>}
      </div>
      <div>
        <Label htmlFor="weightKg">{t('production:weighing.weightKg')}</Label>
        <Input id="weightKg" type="number" step="0.01" {...register('weightKg', { valueAsNumber: true })} />
        {errors.weightKg && <p className="text-destructive text-sm">{errors.weightKg.message}</p>}
      </div>
      <div>
        <Label htmlFor="method">{t('production:weighing.method')}</Label>
        <select
          id="method"
          {...register('method')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {(['SCALE', 'TAPE', 'VISUAL_ESTIMATE'] as const).map(m => (
            <option key={m} value={m}>{t(`production:weighing.methodValue.${m}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="bodyConditionScore">{t('production:weighing.bodyConditionScore')}</Label>
        <Input
          id="bodyConditionScore"
          type="number"
          step="0.1"
          min="1"
          max="5"
          {...register('bodyConditionScore', { valueAsNumber: true })}
        />
      </div>
      <div>
        <Label htmlFor="notes">{t('production:weighing.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
