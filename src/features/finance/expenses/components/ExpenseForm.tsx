import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { localizedName } from '@/lib/catalog';
import { useExpenseCategories } from '@/features/finance/categories/api';
import { useRanches } from '@/features/ranches/api';
import { useAnimals } from '@/features/animals/api';
import { expenseCreateSchema, type ExpenseCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<ExpenseCreateInput>;
  onSubmit: (data: ExpenseCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para egreso manual. */
export function ExpenseForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['finance', 'common']);
  const locale = i18n.language;
  const categories = useExpenseCategories();
  const ranches = useRanches();
  const animals = useAnimals({ size: 200 });
  const { register, handleSubmit, formState: { errors } } = useForm<ExpenseCreateInput>({
    resolver: zodResolver(expenseCreateSchema),
    defaultValues: { currency: 'MXN', incurredAt: new Date().toISOString().slice(0, 10), ...defaultValues }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="expenseCategoryId">{t('finance:expense.category')}</Label>
        <select
          id="expenseCategoryId"
          {...register('expenseCategoryId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {categories.data?.map(c => (
            <option key={c.id} value={c.id}>{localizedName(c, locale)}</option>
          ))}
        </select>
        {errors.expenseCategoryId && <p className="text-destructive text-sm">{errors.expenseCategoryId.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="incurredAt">{t('finance:expense.incurredAt')}</Label>
          <Input id="incurredAt" type="date" {...register('incurredAt')} />
          {errors.incurredAt && <p className="text-destructive text-sm">{errors.incurredAt.message}</p>}
        </div>
        <div>
          <Label htmlFor="amount">{t('finance:expense.amount')}</Label>
          <Input id="amount" type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
          {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="currency">{t('finance:expense.currency')}</Label>
          <Input id="currency" maxLength={3} {...register('currency')} />
        </div>
        <div>
          <Label htmlFor="ranchId">{t('finance:expense.ranch')}</Label>
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
      <div>
        <Label htmlFor="animalId">{t('finance:expense.animal')}</Label>
        <select
          id="animalId"
          {...register('animalId', { setValueAs: v => (v === '' ? undefined : Number(v)) })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {animals.data?.content.map(a => (
            <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="description">{t('finance:expense.description')}</Label>
        <Input id="description" {...register('description')} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="vendor">{t('finance:expense.vendor')}</Label>
          <Input id="vendor" {...register('vendor')} />
        </div>
        <div>
          <Label htmlFor="invoiceNumber">{t('finance:expense.invoiceNumber')}</Label>
          <Input id="invoiceNumber" {...register('invoiceNumber')} />
        </div>
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
