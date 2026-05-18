import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { abortionCreateSchema, type AbortionCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<AbortionCreateInput>;
  onSubmit: (data: AbortionCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para registrar un aborto. */
export function AbortionForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['reproduction', 'common']);
  const females = useAnimals({ sex: 'FEMALE', size: 200 });
  const { register, handleSubmit, formState: { errors } } = useForm<AbortionCreateInput>({
    resolver: zodResolver(abortionCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('reproduction:abortion.animal')}</Label>
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
        <Label htmlFor="abortedAt">{t('reproduction:abortion.abortedAt')}</Label>
        <Input id="abortedAt" type="date" {...register('abortedAt')} />
        {errors.abortedAt && <p className="text-destructive text-sm">{errors.abortedAt.message}</p>}
      </div>
      <div>
        <Label htmlFor="estimatedGestationDays">{t('reproduction:abortion.estimatedGestationDays')}</Label>
        <Input
          id="estimatedGestationDays"
          type="number"
          {...register('estimatedGestationDays', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
        />
      </div>
      <div>
        <Label htmlFor="cause">{t('reproduction:abortion.cause')}</Label>
        <Input id="cause" {...register('cause')} />
      </div>
      <div>
        <Label htmlFor="notes">{t('reproduction:abortion.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
