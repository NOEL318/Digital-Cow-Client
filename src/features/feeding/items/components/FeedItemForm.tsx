import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { feedItemCreateSchema, type FeedItemCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<FeedItemCreateInput>;
  onSubmit: (data: FeedItemCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para registrar/editar un insumo del catalogo de alimentacion. */
export function FeedItemForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['feeding', 'common']);
  const { register, handleSubmit, formState: { errors } } = useForm<FeedItemCreateInput>({
    resolver: zodResolver(feedItemCreateSchema),
    defaultValues: { currency: 'MXN', category: 'CONCENTRATE', ...defaultValues }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="code">{t('feeding:item.code')}</Label>
        <Input id="code" {...register('code')} />
        {errors.code && <p className="text-destructive text-sm">{errors.code.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="nameEs">{t('feeding:item.nameEs')}</Label>
          <Input id="nameEs" {...register('nameEs')} />
          {errors.nameEs && <p className="text-destructive text-sm">{errors.nameEs.message}</p>}
        </div>
        <div>
          <Label htmlFor="nameEn">{t('feeding:item.nameEn')}</Label>
          <Input id="nameEn" {...register('nameEn')} />
          {errors.nameEn && <p className="text-destructive text-sm">{errors.nameEn.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="category">{t('feeding:item.category')}</Label>
        <select
          id="category"
          {...register('category')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          {(['FORAGE', 'SILAGE', 'CONCENTRATE', 'MINERAL', 'BYPRODUCT', 'OTHER'] as const).map(c => (
            <option key={c} value={c}>{t(`feeding:item.categoryValue.${c}`)}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="dryMatterPct">{t('feeding:item.dryMatterPct')}</Label>
          <Input id="dryMatterPct" type="number" step="0.01" {...register('dryMatterPct', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="proteinPct">{t('feeding:item.proteinPct')}</Label>
          <Input id="proteinPct" type="number" step="0.01" {...register('proteinPct', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="energyMcalKg">{t('feeding:item.energyMcalKg')}</Label>
          <Input id="energyMcalKg" type="number" step="0.01" {...register('energyMcalKg', { valueAsNumber: true })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="unitCost">{t('feeding:item.unitCost')}</Label>
          <Input id="unitCost" type="number" step="0.0001" {...register('unitCost', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="currency">{t('feeding:item.currency')}</Label>
          <Input id="currency" maxLength={3} {...register('currency')} />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">{t('feeding:item.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
