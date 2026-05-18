import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBulls } from '@/features/reproduction/bulls/api';
import { semenStrawCreateSchema, type SemenStrawCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<SemenStrawCreateInput>;
  onSubmit: (data: SemenStrawCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para registrar un lote de pajillas de semen.
 */
export function SemenStrawForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['reproduction', 'common']);
  const bulls = useBulls();
  const { register, handleSubmit, formState: { errors } } = useForm<SemenStrawCreateInput>({
    resolver: zodResolver(semenStrawCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="bullId">{t('reproduction:semen.bull')}</Label>
        <select
          id="bullId"
          {...register('bullId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {bulls.data?.map(b => <option key={b.id} value={b.id}>{b.name} ({b.internalCode})</option>)}
        </select>
        {errors.bullId && <p className="text-destructive text-sm">{errors.bullId.message}</p>}
      </div>
      <div>
        <Label htmlFor="provider">{t('reproduction:semen.provider')}</Label>
        <Input id="provider" {...register('provider')} />
      </div>
      <div>
        <Label htmlFor="batchNumber">{t('reproduction:semen.batchNumber')}</Label>
        <Input id="batchNumber" {...register('batchNumber')} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="totalQuantity">{t('reproduction:semen.totalQuantity')}</Label>
          <Input id="totalQuantity" type="number" {...register('totalQuantity', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="availableQuantity">{t('reproduction:semen.availableQuantity')}</Label>
          <Input id="availableQuantity" type="number" {...register('availableQuantity', { valueAsNumber: true })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="receivedAt">{t('reproduction:semen.receivedAt')}</Label>
          <Input id="receivedAt" type="date" {...register('receivedAt')} />
        </div>
        <div>
          <Label htmlFor="expiresAt">{t('reproduction:semen.expiresAt')}</Label>
          <Input id="expiresAt" type="date" {...register('expiresAt')} />
        </div>
      </div>
      <div>
        <Label htmlFor="costPerStraw">{t('reproduction:semen.costPerStraw')}</Label>
        <Input id="costPerStraw" type="number" step="0.01" {...register('costPerStraw', { valueAsNumber: true })} />
      </div>
      <div>
        <Label htmlFor="storageLocation">{t('reproduction:semen.storageLocation')}</Label>
        <Input id="storageLocation" {...register('storageLocation')} />
      </div>
      <div>
        <Label htmlFor="notes">{t('reproduction:semen.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
