import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { expenseCategoryCreateSchema, type ExpenseCategoryCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<ExpenseCategoryCreateInput>;
  onSubmit: (data: ExpenseCategoryCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para categoria de egreso (catalogo de la cuenta). */
export function ExpenseCategoryForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['finance', 'common']);
  const { register, handleSubmit, formState: { errors } } = useForm<ExpenseCategoryCreateInput>({
    resolver: zodResolver(expenseCategoryCreateSchema),
    defaultValues: { kind: 'OTHER', ...defaultValues }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="code">{t('finance:category.code')}</Label>
        <Input id="code" {...register('code')} />
        {errors.code && <p className="text-destructive text-sm">{errors.code.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="nameEs">{t('finance:category.nameEs')}</Label>
          <Input id="nameEs" {...register('nameEs')} />
          {errors.nameEs && <p className="text-destructive text-sm">{errors.nameEs.message}</p>}
        </div>
        <div>
          <Label htmlFor="nameEn">{t('finance:category.nameEn')}</Label>
          <Input id="nameEn" {...register('nameEn')} />
          {errors.nameEn && <p className="text-destructive text-sm">{errors.nameEn.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="kind">{t('finance:category.kind')}</Label>
        <select
          id="kind"
          {...register('kind')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          {(['FEED', 'HEALTH', 'LABOR', 'INFRASTRUCTURE', 'TRANSPORT', 'REPRODUCTION', 'OTHER'] as const).map(k => (
            <option key={k} value={k}>{t(`finance:category.expenseKindValue.${k}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="notes">{t('finance:category.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
