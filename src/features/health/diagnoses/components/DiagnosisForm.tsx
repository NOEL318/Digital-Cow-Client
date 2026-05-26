/**
 * Este componente contiene el formulario para crear o editar registros del modulo health/diagnoses.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAnimals } from '@/features/animals/api';
import { useDiseases } from '@/features/catalog/api/diseases';
import { localizedName } from '@/lib/catalog';
import { diagnosisCreateSchema, type DiagnosisCreateInput } from '../schemas';

interface Props {
  defaultValues?: Partial<DiagnosisCreateInput>;
  onSubmit: (data: DiagnosisCreateInput) => void;
  submitting?: boolean;
}

/**
 * Formulario para registrar un diagnostico de enfermedad.
 */
export function DiagnosisForm({ defaultValues, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['health', 'common']);
  const locale = i18n.language;
  const animals = useAnimals({ size: 200 });
  const diseases = useDiseases();
  const { register, handleSubmit, formState: { errors } } = useForm<DiagnosisCreateInput>({
    resolver: zodResolver(diagnosisCreateSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="animalId">{t('health:animal')}</Label>
        <select
          id="animalId"
          {...register('animalId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {animals.data?.content.map(a => (
            <option key={a.id} value={a.id}>{a.internalTag}{a.name ? ` - ${a.name}` : ''}</option>
          ))}
        </select>
        {errors.animalId && <p className="text-destructive text-sm">{errors.animalId.message}</p>}
      </div>
      <div>
        <Label htmlFor="diseaseId">{t('health:diagnosis.disease')}</Label>
        <select
          id="diseaseId"
          {...register('diseaseId', { valueAsNumber: true })}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          <option value="">--</option>
          {diseases.data?.map(d => (
            <option key={d.id} value={d.id}>{localizedName(d, locale)}</option>
          ))}
        </select>
        {errors.diseaseId && <p className="text-destructive text-sm">{errors.diseaseId.message}</p>}
      </div>
      <div>
        <Label htmlFor="diagnosedAt">{t('health:diagnosis.diagnosedAt')}</Label>
        <Input id="diagnosedAt" type="date" {...register('diagnosedAt')} />
      </div>
      <div>
        <Label htmlFor="severity">{t('health:diagnosis.severity')}</Label>
        <select
          id="severity"
          {...register('severity')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          {(['LOW', 'MEDIUM', 'HIGH'] as const).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="symptoms">{t('health:diagnosis.symptoms')}</Label>
        <Input id="symptoms" {...register('symptoms')} />
      </div>
      <div>
        <Label htmlFor="status">{t('health:diagnosis.status')}</Label>
        <select
          id="status"
          {...register('status')}
          className="w-full border rounded h-10 px-2 bg-background"
        >
          {(['ACTIVE', 'RECOVERED', 'CHRONIC', 'DECEASED'] as const).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
