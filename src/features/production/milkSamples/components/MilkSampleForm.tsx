import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { milkSampleCreateSchema, type MilkSampleCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<MilkSampleCreateInput>;
  onSubmit: (data: MilkSampleCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para registrar una muestra de leche con SCC y composicion. */
export function MilkSampleForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['production', 'common']);
  const animals = useAnimals({ size: 200 });
  const { register, handleSubmit, formState: { errors } } = useForm<MilkSampleCreateInput>({
    resolver: zodResolver(milkSampleCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('production:milkSample.animal')}</Label>
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
        <Label htmlFor="sampledAt">{t('production:milkSample.sampledAt')}</Label>
        <Input id="sampledAt" type="date" {...register('sampledAt')} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="sccCellsPerMl">{t('production:milkSample.scc')}</Label>
          <Input id="sccCellsPerMl" type="number" {...register('sccCellsPerMl', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="fatPct">{t('production:milkSample.fatPct')}</Label>
          <Input id="fatPct" type="number" step="0.01" {...register('fatPct', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="proteinPct">{t('production:milkSample.proteinPct')}</Label>
          <Input id="proteinPct" type="number" step="0.01" {...register('proteinPct', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="lactosePct">{t('production:milkSample.lactosePct')}</Label>
          <Input id="lactosePct" type="number" step="0.01" {...register('lactosePct', { valueAsNumber: true })} />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">{t('production:milkSample.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
