/**
 * Este wizard guia al usuario para registrar la aplicacion de un tratamiento.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Pill, Calendar, Beaker } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useMedications } from '@/features/catalog/api/medications';
import { useCreateTreatment } from '@/features/health/treatments/api';
import { animalsApi } from '@/features/animals/api';
import i18n from '@/lib/i18n';
import { localizedName } from '@/lib/catalog';

/** Wizard "Traté". Pasos: ubicación+animal, medicamento+dosis+fecha, confirmar. */
export function TratarFlow() {
  const { t } = useTranslation('wizard');
  const { t: tCommon } = useTranslation('common');
  const nav = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateTreatment();
  const medications = useMedications();
  const locale = i18n.language;

  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [medicationId, setMedicationId] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [dose, setDose] = useState('');
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

  const med = medications.data?.find(m => m.id === medicationId);
  const milkUntil = med && med.withdrawalMilkDays > 0
    ? new Date(new Date(startedAt).getTime() + med.withdrawalMilkDays * 86400000).toISOString().slice(0, 10)
    : null;
  const meatUntil = med && med.withdrawalMeatDays > 0
    ? new Date(new Date(startedAt).getTime() + med.withdrawalMeatDays * 86400000).toISOString().slice(0, 10)
    : null;

  async function save() {
    setError(null);
    if (!ctx.animal || !medicationId) return;
    try {
      await create.mutateAsync({
        animalId: ctx.animal.id,
        medicationId,
        startedAt,
        dose: dose.trim() || undefined
      });
      qc.invalidateQueries({ queryKey: ['animal', ctx.animal.id] });
      qc.invalidateQueries({ queryKey: ['health', 'treatments'] });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? t('tratar.saveFailed'));
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title={t('tratar.step1Title')}
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title={t('tratar.step2Title')}
        subtitle={t('tratar.step2Subtitle')}
        canAdvance={!!medicationId && !!startedAt}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <HelpfulField id="tx-med" label={t('tratar.medicationLabel')} icon={Pill} required>
          <select id="tx-med" value={medicationId ?? ''}
            onChange={e => setMedicationId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded-md px-3 py-3 text-base bg-background">
            <option value="">{tCommon("placeholder.selectMedication")}</option>
            {(medications.data ?? []).map(m => (
              <option key={m.id} value={m.id}>{localizedName(m, locale)}</option>
            ))}
          </select>
        </HelpfulField>
        <HelpfulField id="tx-date" label={t('tratar.dateLabel')} icon={Calendar} required>
          <input id="tx-date" type="date" value={startedAt}
            onChange={e => setStartedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
        <HelpfulField id="tx-dose" label={t('tratar.doseLabel')} icon={Beaker} help={t('tratar.doseHelp')} example={t('tratar.doseExample')}>
          <input id="tx-dose" value={dose}
            onChange={e => setDose(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
        {med && (milkUntil || meatUntil) ? (
          <div className="text-xs text-muted-foreground border-l-2 pl-3 space-y-0.5">
            <p>{t('tratar.withdrawalTitle')}</p>
            {milkUntil ? <p>{t('tratar.withdrawalMilk')}<strong>{milkUntil}</strong></p> : null}
            {meatUntil ? <p>{t('tratar.withdrawalMeat')}<strong>{meatUntil}</strong></p> : null}
          </div>
        ) : null}
      </WizardStep>
    );
  }

  return (
    <WizardStep current={3} total={3} title={t('tratar.step3Title')}
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
        <p className="flex items-center gap-2"><Pill className="h-4 w-4 text-primary" aria-hidden /> {med ? localizedName(med, locale) : '-'}</p>
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {startedAt}</p>
        {dose ? <p className="text-sm text-muted-foreground">{t('tratar.summaryDose', { dose })}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
