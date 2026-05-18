import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { dryOffCreateSchema, type DryOffCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<DryOffCreateInput>;
  onSubmit: (data: DryOffCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para registrar un secado de lactancia. */
export function DryOffForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['reproduction', 'common']);
  const females = useAnimals({ sex: 'FEMALE', size: 200 });
  const { register, handleSubmit, formState: { errors } } = useForm<DryOffCreateInput>({
    resolver: zodResolver(dryOffCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('reproduction:dryOff.animal')}</Label>
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
        <Label htmlFor="driedOffAt">{t('reproduction:dryOff.driedOffAt')}</Label>
        <Input id="driedOffAt" type="date" {...register('driedOffAt')} />
        {errors.driedOffAt && <p className="text-destructive text-sm">{errors.driedOffAt.message}</p>}
      </div>
      <div>
        <Label htmlFor="lactationDays">{t('reproduction:dryOff.lactationDays')}</Label>
        <Input
          id="lactationDays"
          type="number"
          {...register('lactationDays', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
        />
      </div>
      <div>
        <Label htmlFor="notes">{t('reproduction:dryOff.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
