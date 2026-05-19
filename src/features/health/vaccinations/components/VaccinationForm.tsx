/**
 * Este componente contiene el formulario para crear o editar registros del modulo health/vaccinations.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { useVaccines } from '@/features/catalog/api/vaccines';
import { useVetVisits } from '@/features/health/vetVisits/api';
import { localizedName } from '@/lib/catalog';
import { vaccinationCreateSchema, type VaccinationCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<VaccinationCreateInput>;
  onSubmit: (data: VaccinationCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario de vacunacion individual. Combina catalogos y animales.
 */
export function VaccinationForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['health', 'common']);
  const locale = i18n.language;
  const animals = useAnimals({ size: 200 });
  const vaccines = useVaccines();
  const vetVisits = useVetVisits();
  const { register, handleSubmit, formState: { errors } } = useForm<VaccinationCreateInput>({
    resolver: zodResolver(vaccinationCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">Animal</Label>
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
        <Label htmlFor="vaccineId">{t('health:vaccination.vaccine')}</Label>
        <select
          id="vaccineId"
          {...register('vaccineId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {vaccines.data?.map(v => (
            <option key={v.id} value={v.id}>{localizedName(v, locale)}</option>
          ))}
        </select>
        {errors.vaccineId && <p className="text-destructive text-sm">{errors.vaccineId.message}</p>}
      </div>
      <div>
        <Label htmlFor="appliedAt">{t('health:vaccination.appliedAt')}</Label>
        <Input id="appliedAt" type="date" {...register('appliedAt')} />
      </div>
      <div>
        <Label htmlFor="batchNumber">{t('health:vaccination.batch')}</Label>
        <Input id="batchNumber" {...register('batchNumber')} />
      </div>
      <div>
        <Label htmlFor="doseMl">{t('health:vaccination.doseMl')}</Label>
        <Input
          id="doseMl"
          type="number"
          step="0.01"
          {...register('doseMl', { valueAsNumber: true })}
        />
      </div>
      <div>
        <Label htmlFor="route">{t('health:vaccination.route')}</Label>
        <select
          id="route"
          {...register('route')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {(['IM', 'SC', 'ORAL', 'INTRANASAL', 'TOPICAL'] as const).map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="cost">{t('health:vaccination.cost')}</Label>
        <Input
          id="cost"
          type="number"
          step="0.01"
          {...register('cost', { valueAsNumber: true })}
        />
      </div>
      <div>
        <Label htmlFor="vetVisitId">{t('health:vaccination.vetVisit')}</Label>
        <select
          id="vetVisitId"
          {...register('vetVisitId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {vetVisits.data?.map(v => (
            <option key={v.id} value={v.id}>{v.visitedAt} - {v.vetName}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
