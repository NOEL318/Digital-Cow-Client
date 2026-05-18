import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { heatCreateSchema, type HeatCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<HeatCreateInput>;
  onSubmit: (data: HeatCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para registrar la deteccion de un celo en una hembra.
 */
export function HeatForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['reproduction', 'common']);
  const females = useAnimals({ sex: 'FEMALE', size: 200 });
  const { register, handleSubmit, formState: { errors } } = useForm<HeatCreateInput>({
    resolver: zodResolver(heatCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('reproduction:heat.animal')}</Label>
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
        <Label htmlFor="detectedAt">{t('reproduction:heat.detectedAt')}</Label>
        <Input id="detectedAt" type="datetime-local" {...register('detectedAt')} />
        {errors.detectedAt && <p className="text-destructive text-sm">{errors.detectedAt.message}</p>}
      </div>
      <div>
        <Label htmlFor="detectionMethod">{t('reproduction:heat.detectionMethod')}</Label>
        <select
          id="detectionMethod"
          {...register('detectionMethod')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {(['VISUAL', 'PEDOMETER', 'HEAT_PATCH', 'CAMERA', 'OTHER'] as const).map(m => (
            <option key={m} value={m}>{t(`reproduction:heat.method.${m}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="intensity">{t('reproduction:heat.intensity')}</Label>
        <select
          id="intensity"
          {...register('intensity')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {(['WEAK', 'MODERATE', 'STRONG'] as const).map(i => (
            <option key={i} value={i}>{t(`reproduction:heat.intensityValue.${i}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="notes">{t('reproduction:heat.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
