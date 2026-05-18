import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { feedingPlanCreateSchema, type FeedingPlanCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<FeedingPlanCreateInput>;
  onSubmit: (data: FeedingPlanCreateInput) => void;
  submitting?: boolean;
}

/** Formulario para crear/editar un plan de alimentacion (metadatos). */
export function FeedingPlanForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['feeding', 'common']);
  const { register, handleSubmit, formState: { errors } } = useForm<FeedingPlanCreateInput>({
    resolver: zodResolver(feedingPlanCreateSchema),
    defaultValues: { category: 'DAIRY_LACTATION', ...defaultValues }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">{t('feeding:plan.name')}</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="category">{t('feeding:plan.category')}</Label>
        <select
          id="category"
          {...register('category')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          {(['DAIRY_LACTATION', 'DAIRY_DRY', 'BEEF_GROWING', 'BEEF_FINISHING', 'CALF', 'OTHER'] as const).map(c => (
            <option key={c} value={c}>{t(`feeding:plan.categoryValue.${c}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="description">{t('feeding:plan.description')}</Label>
        <Input id="description" {...register('description')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
