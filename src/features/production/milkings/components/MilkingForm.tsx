/**
 * Este componente contiene el formulario para crear o editar registros del modulo production/milkings.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { milkingCreateSchema, type MilkingCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<MilkingCreateInput>;
  onSubmit: (data: MilkingCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para registrar un ordeño individual de una vaca. */
export function MilkingForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['production', 'common']);
  const animals = useAnimals({ size: 200 });
  const dairyAnimals = animals.data?.content.filter(a => a.status === 'ACTIVE') ?? [];
  const { register, handleSubmit, formState: { errors } } = useForm<MilkingCreateInput>({
    resolver: zodResolver(milkingCreateSchema),
    defaultValues: { session: 'TOTAL', ...defaultValues }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('production:milking.animal')}</Label>
        <select
          id="animalId"
          {...register('animalId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {dairyAnimals.map(a => (
            <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
          ))}
        </select>
        {errors.animalId && <p className="text-destructive text-sm">{errors.animalId.message}</p>}
      </div>
      <div>
        <Label htmlFor="milkingDate">{t('production:milking.milkingDate')}</Label>
        <Input id="milkingDate" type="date" {...register('milkingDate')} />
        {errors.milkingDate && <p className="text-destructive text-sm">{errors.milkingDate.message}</p>}
      </div>
      <div>
        <Label htmlFor="session">{t('production:milking.session')}</Label>
        <select
          id="session"
          {...register('session')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          {(['TOTAL', 'AM', 'PM'] as const).map(s => (
            <option key={s} value={s}>{t(`production:milking.sessionValue.${s}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="liters">{t('production:milking.liters')}</Label>
        <Input id="liters" type="number" step="0.01" {...register('liters', { valueAsNumber: true })} />
        {errors.liters && <p className="text-destructive text-sm">{errors.liters.message}</p>}
      </div>
      <div>
        <Label htmlFor="notes">{t('production:milking.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
