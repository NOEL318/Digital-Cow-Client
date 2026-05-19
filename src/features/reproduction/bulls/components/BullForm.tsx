/**
 * Este componente contiene el formulario para crear o editar registros del modulo reproduction/bulls.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { breedsApi } from '@/features/breeds/api';
import { bullCreateSchema, type BullCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<BullCreateInput>;
  onSubmit: (data: BullCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para crear/editar un toro del catalogo.
 * Cuando source=OWN muestra selector de animales filtrados por sex=MALE.
 */
export function BullForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['reproduction', 'common']);
  const breeds = useQuery({ queryKey: ['breeds'], queryFn: breedsApi.list });
  const males = useAnimals({ sex: 'MALE', size: 200 });
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BullCreateInput>({
    resolver: zodResolver(bullCreateSchema),
    defaultValues: { source: 'OWN', ...defaultValues }
  });
  const source = watch('source');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="internalCode">{t('reproduction:bull.internalCode')}</Label>
        <Input id="internalCode" {...register('internalCode')} />
        {errors.internalCode && <p className="text-destructive text-sm">{errors.internalCode.message}</p>}
      </div>
      <div>
        <Label htmlFor="name">{t('reproduction:bull.name')}</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="breedId">{t('reproduction:bull.breed')}</Label>
        <select
          id="breedId"
          {...register('breedId', { valueAsNumber: true, setValueAs: (v) => v === '' || Number.isNaN(v) ? undefined : Number(v) })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {breeds.data?.map(b => <option key={b.id} value={b.id}>{b.nameEs}</option>)}
        </select>
      </div>
      <div>
        <Label>{t('reproduction:bull.source')}</Label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="OWN" {...register('source')} />
            {t('reproduction:bull.OWN')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="EXTERNAL" {...register('source')} />
            {t('reproduction:bull.EXTERNAL')}
          </label>
        </div>
      </div>
      {source === 'OWN' && (
        <div>
          <Label htmlFor="animalId">{t('reproduction:bull.animal')}</Label>
          <select
            id="animalId"
            {...register('animalId', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            <option value="">--</option>
            {males.data?.content.map(a => (
              <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <Label htmlFor="registryNumber">{t('reproduction:bull.registryNumber')}</Label>
        <Input id="registryNumber" {...register('registryNumber')} />
      </div>
      <div>
        <Label htmlFor="notes">{t('reproduction:bull.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
