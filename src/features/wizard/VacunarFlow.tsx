/**
 * Este wizard guia al usuario para registrar la aplicacion de una vacuna.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Syringe, Calendar, Pill } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { useVaccines } from '@/features/catalog/api/vaccines';
import { useCreateVaccination } from '@/features/health/vaccinations/api';
import { animalsApi } from '@/features/animals/api';

/** Wizard "Vacune" con selector jerárquico. */
export function VacunarFlow() {
  const { t } = useTranslation('wizard');
  const { t: tCommon } = useTranslation('common');
  const nav = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateVaccination();
  const vaccines = useVaccines();
  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [vaccineId, setVaccineId] = useState<number | null>(null);
  const [appliedAt, setAppliedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [batch, setBatch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prefAnimalId || ctx.animal) return;
    animalsApi.get(prefAnimalId).then(a => {
      setCtx({
        ranchId: a.ranchId, lotId: a.lotId ?? null,
        animal: {
          id: a.id, internalTag: a.internalTag, name: a.name ?? null,
          officialTag: a.officialTag ?? null, breedId: a.breedId,
          sex: a.sex, status: a.status, lotId: a.lotId ?? null,
          coverPhotoId: a.coverPhotoId ?? null,
          coverPhotoUrl: (a as { coverPhotoUrl?: string | null }).coverPhotoUrl ?? null
        }
      });
      setStep(2);
    }).catch(() => { /* ignore */ });
  }, [prefAnimalId, ctx.animal]);

  async function save() {
    setError(null);
    if (!ctx.animal || !vaccineId) return;
    try {
      await create.mutateAsync({
        animalId: ctx.animal.id, vaccineId, appliedAt, batchNumber: batch || undefined
      });
      qc.invalidateQueries({ queryKey: ['animal', ctx.animal.id] });
      qc.invalidateQueries({ queryKey: ['health', 'vaccinations'] });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? t('vacunar.saveFailed'));
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title={t('vacunar.step1Title')} canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title={t('vacunar.step2Title')} subtitle={t('vacunar.step2Subtitle')}
        canAdvance={!!vaccineId && !!appliedAt} onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <HelpfulField id="vac-vaccine" label={t('vacunar.vaccineLabel')} icon={Pill} required>
          <select id="vac-vaccine" value={vaccineId ?? ''}
            onChange={e => setVaccineId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background">
            <option value="">{tCommon("placeholder.selectVaccine")}</option>
            {(vaccines.data ?? []).map(v => <option key={v.id} value={v.id}>{v.nameEs}</option>)}
          </select>
        </HelpfulField>
        <HelpfulField id="vac-date" label={t('vacunar.dateLabel')} icon={Calendar} required>
          <input id="vac-date" type="date" value={appliedAt}
            onChange={e => setAppliedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
        <HelpfulField id="vac-batch" label={t('vacunar.batchLabel')} help={t('vacunar.batchHelp')} example={t('vacunar.batchExample')}>
          <input id="vac-batch" value={batch} onChange={e => setBatch(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
      </WizardStep>
    );
  }

  const vac = vaccines.data?.find(v => v.id === vaccineId);
  return (
    <WizardStep current={3} total={3} title={t('vacunar.step3Title')}
      canAdvance={!create.isPending} onNext={save} onBack={() => setStep(2)} isLast>
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <AnimalAvatar photoUrl={ctx.animal?.coverPhotoUrl}
            internalTag={ctx.animal?.internalTag ?? ''} name={ctx.animal?.name} size={64} />
          <div>
            <p className="font-bold text-lg">{ctx.animal?.internalTag}</p>
            {ctx.animal?.name ? <p className="text-sm text-muted-foreground">{ctx.animal.name}</p> : null}
          </div>
        </div>
        <p className="flex items-center gap-2"><Syringe className="h-4 w-4 text-primary" aria-hidden /> {vac?.nameEs}</p>
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {appliedAt}</p>
        {batch ? <p className="text-sm text-muted-foreground">{t('vacunar.summaryBatch', { batch })}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
