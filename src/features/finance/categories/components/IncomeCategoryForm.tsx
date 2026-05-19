/**
 * Este componente contiene el formulario para crear o editar registros del modulo finance/categories.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { incomeCategoryCreateSchema, type IncomeCategoryCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<IncomeCategoryCreateInput>;
  onSubmit: (data: IncomeCategoryCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para categoria de ingreso (catalogo de la cuenta). */
export function IncomeCategoryForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['finance', 'common']);
  const { register, handleSubmit, formState: { errors } } = useForm<IncomeCategoryCreateInput>({
    resolver: zodResolver(incomeCategoryCreateSchema),
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
          {(['ANIMAL_SALE', 'MILK_SALE', 'BYPRODUCT', 'SERVICE', 'OTHER'] as const).map(k => (
            <option key={k} value={k}>{t(`finance:category.incomeKindValue.${k}`)}</option>
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
