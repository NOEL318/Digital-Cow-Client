/**
 * Este wizard guia al usuario para registrar un parto y los datos del ternero.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Baby, Calendar, Smile, HelpingHand, Frown, Scissors, Skull } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { BigPicker } from '@/components/ui/big-picker';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useCreateCalving } from '@/features/reproduction/calvings/api';
import { animalsApi } from '@/features/animals/api';

type Ease = 'FREE' | 'EASY' | 'ASSISTED' | 'DIFFICULT' | 'SURGERY';
type Outcome = 'LIVE' | 'STILLBORN' | 'TWIN_LIVE' | 'TWIN_MIXED' | 'TWIN_STILLBORN';
type Sex = 'FEMALE' | 'MALE';

/** Wizard "Parto". Pasos: madre, dificultad+resultado+becerro, confirmar. */
export function PartoFlow() {
  const { t } = useTranslation('wizard');
  const { t: tCommon } = useTranslation('common');
  const nav = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateCalving();
  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [calvedAt, setCalvedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [ease, setEase] = useState<Ease>('FREE');
  const [outcome, setOutcome] = useState<Outcome>('LIVE');
  const [calfSex, setCalfSex] = useState<Sex | null>(null);
  const [weight, setWeight] = useState('');
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
        calvedAt,
        ease,
        outcome,
        calfSex: calfSex ?? undefined,
        calfBirthWeightKg: weight ? Number(weight) : undefined
      });
      qc.invalidateQueries({ queryKey: ['animal', ctx.animal.id] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'calvings'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['animals'] });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? t('parto.saveFailed'));
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title={t('parto.step1Title')}
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} sexFilter="FEMALE" />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title={t('parto.step2Title')}
        canAdvance={!!calvedAt}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <HelpfulField id="parto-date" label={t('parto.dateLabel')} icon={Calendar} required>
          <input id="parto-date" type="date" value={calvedAt}
            onChange={e => setCalvedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>

        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('parto.easeLabel')}</p>
          <BigPicker<Ease>
            options={[
              { value: 'FREE', label: t('parto.ease.FREE'), icon: Smile, description: t('parto.easeDesc.FREE') },
              { value: 'EASY', label: t('parto.ease.EASY'), icon: Smile },
              { value: 'ASSISTED', label: t('parto.ease.ASSISTED'), icon: HelpingHand },
              { value: 'DIFFICULT', label: t('parto.ease.DIFFICULT'), icon: Frown },
              { value: 'SURGERY', label: t('parto.ease.SURGERY'), icon: Scissors }
            ]}
            value={ease}
            onChange={setEase}
            ariaLabel={t('parto.easeLabel')}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('parto.outcomeLabel')}</p>
          <BigPicker<Outcome>
            options={[
              { value: 'LIVE', label: t('parto.outcome.LIVE'), icon: Baby },
              { value: 'STILLBORN', label: t('parto.outcome.STILLBORN'), icon: Skull },
              { value: 'TWIN_LIVE', label: t('parto.outcome.TWIN_LIVE'), icon: Baby },
              { value: 'TWIN_MIXED', label: t('parto.outcome.TWIN_MIXED'), icon: HelpingHand },
              { value: 'TWIN_STILLBORN', label: t('parto.outcome.TWIN_STILLBORN'), icon: Skull }
            ]}
            value={outcome}
            onChange={setOutcome}
            ariaLabel={t('parto.outcomeLabel')}
          />
        </div>

        {outcome !== 'STILLBORN' && outcome !== 'TWIN_STILLBORN' ? (
          <>
            <div className="space-y-2">
              <p className="text-sm font-semibold">{tCommon("labels.calfSex")}</p>
              <BigPicker<Sex>
                options={[
                  { value: 'FEMALE', label: t('comprar.sex.FEMALE') },
                  { value: 'MALE', label: t('comprar.sex.MALE') }
                ]}
                value={calfSex ?? undefined}
                onChange={setCalfSex}
                ariaLabel={tCommon("labels.calfSex")}
              />
            </div>

            <HelpfulField id="parto-w" label={t('parto.calfWeightLabel')} example={t('parto.calfWeightExample')}>
              <input id="parto-w" type="number" inputMode="decimal" min={0} step={0.1}
                value={weight} onChange={e => setWeight(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-base bg-background" />
            </HelpfulField>
          </>
        ) : null}
      </WizardStep>
    );
  }

  const easeLabel = t(`parto.ease.${ease}` as const);
  const outcomeLabel = t(`parto.outcome.${outcome}` as const);
  return (
    <WizardStep current={3} total={3} title={t('parto.step3Title')}
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
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {calvedAt}</p>
        <p className="text-sm text-muted-foreground">{t('parto.summaryEase', { ease: easeLabel })}</p>
        <p className="text-sm text-muted-foreground">{t('parto.summaryOutcome', { outcome: outcomeLabel })}</p>
        {calfSex ? (
          <p className="text-sm text-muted-foreground">
            {calfSex === 'FEMALE' ? t('parto.summaryCalfFemale') : t('parto.summaryCalfMale')}
            {weight ? t('parto.summaryCalfWeight', { weight }) : ''}
          </p>
        ) : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
