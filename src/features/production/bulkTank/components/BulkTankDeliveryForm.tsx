import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRanches } from '@/features/ranches/api';
import { bulkTankDeliveryCreateSchema, type BulkTankDeliveryCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<BulkTankDeliveryCreateInput>;
  onSubmit: (data: BulkTankDeliveryCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para registrar entrega de tanque a granel. */
export function BulkTankDeliveryForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['production', 'common']);
  const ranches = useRanches();
  const { register, handleSubmit, formState: { errors } } = useForm<BulkTankDeliveryCreateInput>({
    resolver: zodResolver(bulkTankDeliveryCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="ranchId">{t('production:bulkTank.ranch')}</Label>
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
        <Label htmlFor="deliveryDate">{t('production:bulkTank.deliveryDate')}</Label>
        <Input id="deliveryDate" type="date" {...register('deliveryDate')} />
      </div>
      <div>
        <Label htmlFor="totalLiters">{t('production:bulkTank.totalLiters')}</Label>
        <Input id="totalLiters" type="number" step="0.01" {...register('totalLiters', { valueAsNumber: true })} />
        {errors.totalLiters && <p className="text-destructive text-sm">{errors.totalLiters.message}</p>}
      </div>
      <div>
        <Label htmlFor="buyer">{t('production:bulkTank.buyer')}</Label>
        <Input id="buyer" {...register('buyer')} />
      </div>
      <div>
        <Label htmlFor="notes">{t('production:bulkTank.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
