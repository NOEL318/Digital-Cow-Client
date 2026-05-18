import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { slaughterResultCreateSchema, type SlaughterResultCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<SlaughterResultCreateInput>;
  onSubmit: (data: SlaughterResultCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para resultado de sacrificio. Si live y carcass se ingresan,
 * calcula y muestra rendimiento (el backend recalcula al persistir).
 */
export function SlaughterResultForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['production', 'common']);
  const animals = useAnimals({ size: 200 });
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SlaughterResultCreateInput>({
    resolver: zodResolver(slaughterResultCreateSchema),
    defaultValues
  });

  const live = watch('liveWeightKg');
  const carcass = watch('carcassWeightKg');
  const previewYield = (live && carcass && live > 0)
    ? ((carcass / live) * 100).toFixed(2)
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('production:slaughter.animal')}</Label>
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
        <Label htmlFor="slaughteredAt">{t('production:slaughter.slaughteredAt')}</Label>
        <Input id="slaughteredAt" type="date" {...register('slaughteredAt')} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="liveWeightKg">{t('production:slaughter.liveWeightKg')}</Label>
          <Input id="liveWeightKg" type="number" step="0.01" {...register('liveWeightKg', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="carcassWeightKg">{t('production:slaughter.carcassWeightKg')}</Label>
          <Input id="carcassWeightKg" type="number" step="0.01" {...register('carcassWeightKg', { valueAsNumber: true })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="yieldPct">{t('production:slaughter.yieldPct')}</Label>
          <Input id="yieldPct" type="number" step="0.01" {...register('yieldPct', { valueAsNumber: true })} />
          {previewYield && <p className="text-xs text-muted-foreground mt-1">{previewYield}%</p>}
        </div>
        <div>
          <Label htmlFor="grade">{t('production:slaughter.grade')}</Label>
          <Input id="grade" {...register('grade')} />
        </div>
      </div>
      <div>
        <Label htmlFor="buyer">{t('production:slaughter.buyer')}</Label>
        <Input id="buyer" {...register('buyer')} />
      </div>
      <div>
        <Label htmlFor="notes">{t('production:slaughter.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
