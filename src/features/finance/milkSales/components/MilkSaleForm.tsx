/**
 * Este componente contiene el formulario para crear o editar registros del modulo finance/milkSales.
 */
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRanches } from '@/features/ranches/api';
import { useBulkTankDeliveries } from '@/features/production/bulkTank/api';
import { milkSaleCreateSchema, type MilkSaleCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<MilkSaleCreateInput>;
  onSubmit: (data: MilkSaleCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para venta de leche. total_price = total_liters * price_per_liter
 * reactivo; el usuario puede overridear.
 */
export function MilkSaleForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['finance', 'common']);
  const ranches = useRanches();
  const deliveries = useBulkTankDeliveries();
  const {
    register, handleSubmit, watch, setValue, formState: { errors, dirtyFields }
  } = useForm<MilkSaleCreateInput>({
    resolver: zodResolver(milkSaleCreateSchema),
    defaultValues: {
      currency: 'MXN',
      saleDate: new Date().toISOString().slice(0, 10),
      ...defaultValues
    }
  });

  const totalLiters = watch('totalLiters');
  const pricePerLiter = watch('pricePerLiter');
  const ranchId = watch('ranchId');

  useEffect(() => {
    if (dirtyFields.totalPrice) return;
    const l = Number(totalLiters);
    const p = Number(pricePerLiter);
    if (!Number.isNaN(l) && !Number.isNaN(p) && l > 0 && p > 0) {
      setValue('totalPrice', Number((l * p).toFixed(2)), { shouldValidate: true });
    }
  }, [totalLiters, pricePerLiter, dirtyFields.totalPrice, setValue]);

  const filteredDeliveries = ranchId
    ? deliveries.data?.filter(d => d.ranchId === Number(ranchId))
    : deliveries.data;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="saleDate">{t('finance:milkSale.saleDate')}</Label>
          <Input id="saleDate" type="date" {...register('saleDate')} />
          {errors.saleDate && <p className="text-destructive text-sm">{errors.saleDate.message}</p>}
        </div>
        <div>
          <Label htmlFor="ranchId">{t('finance:milkSale.ranch')}</Label>
          <select
            id="ranchId"
            {...register('ranchId', { setValueAs: v => (v === '' ? undefined : Number(v)) })}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            <option value="">--</option>
            {ranches.data?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="totalLiters">{t('finance:milkSale.totalLiters')}</Label>
          <Input id="totalLiters" type="number" step="0.01" {...register('totalLiters', { valueAsNumber: true })} />
          {errors.totalLiters && <p className="text-destructive text-sm">{errors.totalLiters.message}</p>}
        </div>
        <div>
          <Label htmlFor="pricePerLiter">{t('finance:milkSale.pricePerLiter')}</Label>
          <Input id="pricePerLiter" type="number" step="0.0001" {...register('pricePerLiter', { valueAsNumber: true })} />
          {errors.pricePerLiter && <p className="text-destructive text-sm">{errors.pricePerLiter.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="totalPrice">{t('finance:milkSale.totalPrice')}</Label>
        <Input id="totalPrice" type="number" step="0.01" {...register('totalPrice', { valueAsNumber: true })} />
        {errors.totalPrice && <p className="text-destructive text-sm">{errors.totalPrice.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="currency">{t('finance:milkSale.currency')}</Label>
          <Input id="currency" maxLength={3} {...register('currency')} />
        </div>
        <div>
          <Label htmlFor="buyer">{t('finance:milkSale.buyer')}</Label>
          <Input id="buyer" {...register('buyer')} />
        </div>
      </div>
      <div>
        <Label htmlFor="bulkTankDeliveryId">{t('finance:milkSale.bulkTankDelivery')}</Label>
        <select
          id="bulkTankDeliveryId"
          {...register('bulkTankDeliveryId', { setValueAs: v => (v === '' ? undefined : Number(v)) })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {filteredDeliveries?.map(d => (
            <option key={d.id} value={d.id}>{d.deliveryDate} - {d.totalLiters} L</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="notes">{t('finance:milkSale.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <div className="text-sm text-amber-700 dark:text-amber-400 border-l-2 border-amber-500 pl-3">
        {t('finance:milkSale.warning')}
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
