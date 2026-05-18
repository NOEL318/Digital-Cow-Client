import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { useRanches, useLots } from '@/features/ranches/api';
import { breedsApi } from '@/features/breeds/api';
import { calvingCreateSchema, type CalvingCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<CalvingCreateInput>;
  onSubmit: (data: CalvingCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para registrar un parto.
 * Cuando createCalfAnimal=true, despliega sub-form para crear becerro como Animal.
 */
export function CalvingForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['reproduction', 'common', 'animals']);
  const females = useAnimals({ sex: 'FEMALE', size: 200 });
  const ranches = useRanches();
  const breeds = useQuery({ queryKey: ['breeds'], queryFn: breedsApi.list });
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CalvingCreateInput>({
    resolver: zodResolver(calvingCreateSchema),
    defaultValues: { ease: 'FREE', outcome: 'LIVE', createCalfAnimal: false, ...defaultValues }
  });

  const createCalf = watch('createCalfAnimal');
  const calfRanchId = watch('calfRanchId');
  const lots = useLots(calfRanchId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('reproduction:calving.animal')}</Label>
        <select
          id="animalId"
          {...register('animalId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {females.data?.content.map(a => (
            <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
          ))}
        </select>
        {errors.animalId && <p className="text-destructive text-sm">{errors.animalId.message}</p>}
      </div>
      <div>
        <Label htmlFor="calvedAt">{t('reproduction:calving.calvedAt')}</Label>
        <Input id="calvedAt" type="date" {...register('calvedAt')} />
        {errors.calvedAt && <p className="text-destructive text-sm">{errors.calvedAt.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="ease">{t('reproduction:calving.ease')}</Label>
          <select
            id="ease"
            {...register('ease')}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            {(['FREE', 'EASY', 'ASSISTED', 'DIFFICULT', 'SURGERY'] as const).map(e => (
              <option key={e} value={e}>{t(`reproduction:calving.easeValue.${e}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="outcome">{t('reproduction:calving.outcome')}</Label>
          <select
            id="outcome"
            {...register('outcome')}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            {(['LIVE', 'STILLBORN', 'TWIN_LIVE', 'TWIN_MIXED', 'TWIN_STILLBORN'] as const).map(o => (
              <option key={o} value={o}>{t(`reproduction:calving.outcomeValue.${o}`)}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="calfSex">{t('reproduction:calving.calfSex')}</Label>
          <select
            id="calfSex"
            {...register('calfSex')}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            <option value="">--</option>
            <option value="FEMALE">{t('animals:sex.FEMALE')}</option>
            <option value="MALE">{t('animals:sex.MALE')}</option>
          </select>
        </div>
        <div>
          <Label htmlFor="calfBirthWeightKg">{t('reproduction:calving.calfBirthWeight')}</Label>
          <Input
            id="calfBirthWeightKg"
            type="number"
            step="0.01"
            {...register('calfBirthWeightKg', { valueAsNumber: true })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">{t('reproduction:calving.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <div className="border-t pt-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('createCalfAnimal')} />
          {t('reproduction:calving.createCalfAnimal')}
        </label>
      </div>
      {createCalf && (
        <div className="border rounded p-3 space-y-3 bg-muted/40">
          <div>
            <Label htmlFor="calfInternalTag">{t('reproduction:calving.calfInternalTag')}</Label>
            <Input id="calfInternalTag" {...register('calfInternalTag')} />
            {errors.calfInternalTag && <p className="text-destructive text-sm">{errors.calfInternalTag.message}</p>}
          </div>
          <div>
            <Label htmlFor="calfRanchId">{t('reproduction:calving.calfRanch')}</Label>
            <select
              id="calfRanchId"
              {...register('calfRanchId', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
              className="w-full border rounded h-10 px-2 bg-background"
            >
              <option value="">--</option>
              {ranches.data?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            {errors.calfRanchId && <p className="text-destructive text-sm">{errors.calfRanchId.message}</p>}
          </div>
          <div>
            <Label htmlFor="calfLotId">{t('reproduction:calving.calfLot')}</Label>
            <select
              id="calfLotId"
              {...register('calfLotId', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
              className="w-full border rounded h-10 px-2 bg-background"
            >
              <option value="">--</option>
              {lots.data?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="calfBreedId">{t('reproduction:calving.calfBreed')}</Label>
            <select
              id="calfBreedId"
              {...register('calfBreedId', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
              className="w-full border rounded h-10 px-2 bg-background"
            >
              <option value="">--</option>
              {breeds.data?.map(b => <option key={b.id} value={b.id}>{b.nameEs}</option>)}
            </select>
            {errors.calfBreedId && <p className="text-destructive text-sm">{errors.calfBreedId.message}</p>}
          </div>
          <div>
            <Label htmlFor="calfPurpose">{t('reproduction:calving.calfPurpose')}</Label>
            <select
              id="calfPurpose"
              {...register('calfPurpose')}
              className="w-full border rounded h-10 px-2 bg-background"
            >
              <option value="">--</option>
              <option value="BEEF">{t('animals:purpose.BEEF')}</option>
              <option value="DAIRY">{t('animals:purpose.DAIRY')}</option>
              <option value="DUAL">{t('animals:purpose.DUAL')}</option>
            </select>
            {errors.calfPurpose && <p className="text-destructive text-sm">{errors.calfPurpose.message}</p>}
          </div>
        </div>
      )}
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
