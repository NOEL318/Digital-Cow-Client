/**
 * Este componente contiene el formulario para crear o editar registros del modulo reproduction/weanings.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { weaningCreateSchema, type WeaningCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<WeaningCreateInput>;
  onSubmit: (data: WeaningCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para registrar un destete. */
export function WeaningForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['reproduction', 'common']);
  const animals = useAnimals({ size: 500 });
  const { register, handleSubmit, formState: { errors } } = useForm<WeaningCreateInput>({
    resolver: zodResolver(weaningCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('reproduction:weaning.animal')}</Label>
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
        <Label htmlFor="weanedAt">{t('reproduction:weaning.weanedAt')}</Label>
        <Input id="weanedAt" type="date" {...register('weanedAt')} />
        {errors.weanedAt && <p className="text-destructive text-sm">{errors.weanedAt.message}</p>}
      </div>
      <div>
        <Label htmlFor="weightKg">{t('reproduction:weaning.weightKg')}</Label>
        <Input
          id="weightKg"
          type="number"
          step="0.01"
          {...register('weightKg', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
        />
      </div>
      <div>
        <Label htmlFor="notes">{t('reproduction:weaning.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
