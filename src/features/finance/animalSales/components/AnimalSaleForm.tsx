/**
 * Este componente contiene el formulario para crear o editar registros del modulo finance/animalSales.
 */
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { animalSaleCreateSchema, type AnimalSaleCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<AnimalSaleCreateInput>;
  onSubmit: (data: AnimalSaleCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para venta de animal. El selector muestra solo animales con
 * status='ACTIVE'. total_price se calcula reactivamente como
 * liveWeightKg * pricePerKg pero permite override manual.
 */
export function AnimalSaleForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['finance', 'common']);
  const animals = useAnimals({ size: 500 });
  const {
    register, handleSubmit, watch, setValue, formState: { errors, dirtyFields }
  } = useForm<AnimalSaleCreateInput>({
    resolver: zodResolver(animalSaleCreateSchema),
    defaultValues: {
      currency: 'MXN',
      soldAt: new Date().toISOString().slice(0, 10),
      ...defaultValues
    }
  });

  const liveWeightKg = watch('liveWeightKg');
  const pricePerKg = watch('pricePerKg');

  useEffect(() => {
    if (dirtyFields.totalPrice) return;
    const w = Number(liveWeightKg);
    const p = Number(pricePerKg);
    if (!Number.isNaN(w) && !Number.isNaN(p) && w > 0 && p > 0) {
      setValue('totalPrice', Number((w * p).toFixed(2)), { shouldValidate: true });
    }
  }, [liveWeightKg, pricePerKg, dirtyFields.totalPrice, setValue]);

  const activeAnimals = animals.data?.content.filter(a => a.status === 'ACTIVE') ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('finance:animalSale.animal')}</Label>
        <select
          id="animalId"
          {...register('animalId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {activeAnimals.map(a => (
            <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
          ))}
        </select>
        {errors.animalId && <p className="text-destructive text-sm">{errors.animalId.message}</p>}
      </div>
      <div>
        <Label htmlFor="soldAt">{t('finance:animalSale.soldAt')}</Label>
        <Input id="soldAt" type="date" {...register('soldAt')} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="liveWeightKg">{t('finance:animalSale.liveWeightKg')}</Label>
          <Input id="liveWeightKg" type="number" step="0.01" {...register('liveWeightKg', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="pricePerKg">{t('finance:animalSale.pricePerKg')}</Label>
          <Input id="pricePerKg" type="number" step="0.0001" {...register('pricePerKg', { valueAsNumber: true })} />
        </div>
      </div>
      <div>
        <Label htmlFor="totalPrice">{t('finance:animalSale.totalPrice')}</Label>
        <Input id="totalPrice" type="number" step="0.01" {...register('totalPrice', { valueAsNumber: true })} />
        <p className="text-xs text-muted-foreground mt-1">
          {t('finance:animalSale.calculated')} ({t('finance:animalSale.override')})
        </p>
        {errors.totalPrice && <p className="text-destructive text-sm">{errors.totalPrice.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="currency">{t('finance:animalSale.currency')}</Label>
          <Input id="currency" maxLength={3} {...register('currency')} />
        </div>
        <div>
          <Label htmlFor="buyer">{t('finance:animalSale.buyer')}</Label>
          <Input id="buyer" {...register('buyer')} />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">{t('finance:animalSale.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <div className="text-sm text-amber-700 dark:text-amber-400 border-l-2 border-amber-500 pl-3">
        {t('finance:animalSale.warning')}
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
