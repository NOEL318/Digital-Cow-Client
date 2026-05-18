import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { useBulls } from '@/features/reproduction/bulls/api';
import { useSemenStraws } from '@/features/reproduction/semen/api';
import { serviceEventCreateSchema, type ServiceEventCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<ServiceEventCreateInput>;
  onSubmit: (data: ServiceEventCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para registrar un servicio reproductivo.
 * Calcula la fecha estimada de parto (service_date + 283 dias) en tiempo real.
 * Selecciona bull cuando serviceType es AI o NATURAL; selecciona pajilla cuando es AI.
 */
export function ServiceEventForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['reproduction', 'common']);
  const females = useAnimals({ sex: 'FEMALE', size: 200 });
  const bulls = useBulls();
  const straws = useSemenStraws();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ServiceEventCreateInput>({
    resolver: zodResolver(serviceEventCreateSchema),
    defaultValues: { serviceType: 'AI', ...defaultValues }
  });

  const serviceType = watch('serviceType');
  const serviceDate = watch('serviceDate');
  const estimatedCalving = serviceDate
    ? new Date(new Date(serviceDate).getTime() + 283 * 86400000).toISOString().slice(0, 10)
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('reproduction:service.animal')}</Label>
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
        <Label htmlFor="serviceType">{t('reproduction:service.serviceType')}</Label>
        <select
          id="serviceType"
          {...register('serviceType')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          {(['AI', 'NATURAL', 'EMBRYO_TRANSFER'] as const).map(s => (
            <option key={s} value={s}>{t(`reproduction:service.type.${s}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="serviceDate">{t('reproduction:service.serviceDate')}</Label>
        <Input id="serviceDate" type="date" {...register('serviceDate')} />
        {errors.serviceDate && <p className="text-destructive text-sm">{errors.serviceDate.message}</p>}
      </div>
      {(serviceType === 'AI' || serviceType === 'NATURAL') && (
        <div>
          <Label htmlFor="bullId">{t('reproduction:service.bull')}</Label>
          <select
            id="bullId"
            {...register('bullId', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            <option value="">--</option>
            {bulls.data?.map(b => <option key={b.id} value={b.id}>{b.name} ({b.internalCode})</option>)}
          </select>
          {errors.bullId && <p className="text-destructive text-sm">{errors.bullId.message}</p>}
        </div>
      )}
      {serviceType === 'AI' && (
        <div>
          <Label htmlFor="semenStrawId">{t('reproduction:service.semenStraw')}</Label>
          <select
            id="semenStrawId"
            {...register('semenStrawId', { setValueAs: (v) => v === '' ? undefined : Number(v) })}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            <option value="">--</option>
            {straws.data?.filter(s => s.availableQuantity > 0).map(s => (
              <option key={s.id} value={s.id}>{s.batchNumber ?? '-'} ({s.availableQuantity})</option>
            ))}
          </select>
          {errors.semenStrawId && <p className="text-destructive text-sm">{errors.semenStrawId.message}</p>}
        </div>
      )}
      <div>
        <Label htmlFor="technicianName">{t('reproduction:service.technician')}</Label>
        <Input id="technicianName" {...register('technicianName')} />
      </div>
      <div>
        <Label htmlFor="cost">{t('reproduction:service.cost')}</Label>
        <Input id="cost" type="number" step="0.01" {...register('cost', { valueAsNumber: true })} />
      </div>
      <div>
        <Label htmlFor="notes">{t('reproduction:service.notes')}</Label>
        <Input id="notes" {...register('notes')} />
      </div>
      {estimatedCalving && (
        <p className="text-sm text-muted-foreground">
          {t('reproduction:service.estimatedCalvingDate')}: {estimatedCalving}
        </p>
      )}
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
