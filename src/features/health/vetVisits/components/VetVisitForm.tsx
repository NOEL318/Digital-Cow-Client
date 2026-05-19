/**
 * Este componente contiene el formulario para crear o editar registros del modulo health/vetVisits.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRanches } from '@/features/ranches/api';
import { vetVisitCreateSchema, type VetVisitCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<VetVisitCreateInput>;
  onSubmit: (data: VetVisitCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario de visita veterinaria. Carga la lista de ranchos del usuario.
 */
export function VetVisitForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['health', 'common', 'animals']);
  const ranches = useRanches();
  const { register, handleSubmit, formState: { errors } } = useForm<VetVisitCreateInput>({
    resolver: zodResolver(vetVisitCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="ranchId">{t('animals:fields.ranch')}</Label>
        <select
          id="ranchId"
          {...register('ranchId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {ranches.data?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        {errors.ranchId && <p className="text-destructive text-sm">{errors.ranchId.message}</p>}
      </div>
      <div>
        <Label htmlFor="visitedAt">{t('health:visit.title')}</Label>
        <Input id="visitedAt" type="date" {...register('visitedAt')} />
      </div>
      <div>
        <Label htmlFor="vetName">{t('health:visit.vetName')}</Label>
        <Input id="vetName" {...register('vetName')} />
      </div>
      <div>
        <Label htmlFor="vetContact">{t('health:visit.vetContact')}</Label>
        <Input id="vetContact" {...register('vetContact')} />
      </div>
      <div>
        <Label htmlFor="reason">{t('health:visit.reason')}</Label>
        <Input id="reason" {...register('reason')} />
      </div>
      <div>
        <Label htmlFor="totalCost">{t('health:visit.totalCost')}</Label>
        <Input
          id="totalCost"
          type="number"
          step="0.01"
          {...register('totalCost', { valueAsNumber: true })}
        />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
