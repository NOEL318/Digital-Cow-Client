/**
 * Este wizard guia al usuario para registrar el secado de una vaca.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { MilkOff, Calendar } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useCreateDryOff } from '@/features/reproduction/dryOffs/api';
import { animalsApi } from '@/features/animals/api';

/** Wizard "Sequé". Pasos: vaca, fecha+días de lactancia, confirmar. */
export function SecarFlow() {
  const { t } = useTranslation('wizard');
  const nav = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateDryOff();
  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [driedOffAt, setDriedOffAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [lactationDays, setLactationDays] = useState('');
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
    if (!ctx.animal) return;
    try {
      await create.mutateAsync({
        animalId: ctx.animal.id,
        driedOffAt,
        lactationDays: lactationDays ? Number(lactationDays) : undefined
      });
      qc.invalidateQueries({ queryKey: ['animal', ctx.animal.id] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'dry-offs'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? t('secar.saveFailed'));
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title={t('secar.step1Title')}
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} sexFilter="FEMALE" />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title={t('secar.step2Title')}
        canAdvance={!!driedOffAt}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <HelpfulField id="dry-date" label={t('secar.dateLabel')} icon={Calendar} required>
          <input id="dry-date" type="date" value={driedOffAt}
            onChange={e => setDriedOffAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
        <HelpfulField id="dry-days" label={t('secar.lactationLabel')} help={t('secar.lactationHelp')} example={t('secar.lactationExample')}>
          <input id="dry-days" type="number" inputMode="numeric" min={0}
            value={lactationDays} onChange={e => setLactationDays(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
      </WizardStep>
    );
  }

  return (
    <WizardStep current={3} total={3} title={t('secar.step3Title')}
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
        <p className="flex items-center gap-2"><MilkOff className="h-4 w-4 text-primary" aria-hidden /> {t('secar.summaryDried')}</p>
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {driedOffAt}</p>
        {lactationDays ? <p className="text-sm text-muted-foreground">{t('secar.summaryLactation', { days: lactationDays })}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
