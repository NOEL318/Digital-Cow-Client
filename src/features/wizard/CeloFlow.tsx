/**
 * Este wizard guia al usuario para registrar la deteccion de un celo.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Heart, Calendar, Eye, Activity, Thermometer, Camera, MoreHorizontal, Flame, Sparkle, Sparkles } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { BigPicker } from '@/components/ui/big-picker';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useCreateHeat } from '@/features/reproduction/heats/api';
import { animalsApi } from '@/features/animals/api';

type Method = 'VISUAL' | 'PEDOMETER' | 'HEAT_PATCH' | 'CAMERA' | 'OTHER';
type Intensity = 'WEAK' | 'MODERATE' | 'STRONG';

/** Wizard "Vi un celo". Pasos: hembra, fecha+intensidad+método, confirmar. */
export function CeloFlow() {
  const { t } = useTranslation('wizard');
  const nav = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateHeat();
  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [detectedAt, setDetectedAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [intensity, setIntensity] = useState<Intensity>('MODERATE');
  const [method, setMethod] = useState<Method>('VISUAL');
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
        detectedAt: new Date(detectedAt).toISOString(),
        intensity,
        detectionMethod: method
      });
      qc.invalidateQueries({ queryKey: ['animal', ctx.animal.id] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'heats'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? t('celo.saveFailed'));
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title={t('celo.step1Title')}
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} sexFilter="FEMALE" />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title={t('celo.step2Title')}
        canAdvance={!!detectedAt}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('celo.intensityLabel')}</p>
          <BigPicker<Intensity>
            options={[
              { value: 'WEAK', label: t('celo.intensity.WEAK'), icon: Sparkle, description: t('celo.intensityDesc.WEAK') },
              { value: 'MODERATE', label: t('celo.intensity.MODERATE'), icon: Sparkles, description: t('celo.intensityDesc.MODERATE') },
              { value: 'STRONG', label: t('celo.intensity.STRONG'), icon: Flame, description: t('celo.intensityDesc.STRONG') }
            ]}
            value={intensity}
            onChange={setIntensity}
            ariaLabel={t('celo.intensityLabel')}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('celo.detectionLabel')}</p>
          <BigPicker<Method>
            options={[
              { value: 'VISUAL', label: t('celo.method.VISUAL'), icon: Eye },
              { value: 'PEDOMETER', label: t('celo.method.PEDOMETER'), icon: Activity },
              { value: 'HEAT_PATCH', label: t('celo.method.HEAT_PATCH'), icon: Thermometer },
              { value: 'CAMERA', label: t('celo.method.CAMERA'), icon: Camera },
              { value: 'OTHER', label: t('celo.method.OTHER'), icon: MoreHorizontal }
            ]}
            value={method}
            onChange={setMethod}
            ariaLabel={t('celo.detectionLabel')}
          />
        </div>

        <HelpfulField id="celo-date" label={t('celo.dateLabel')} icon={Calendar} required>
          <input id="celo-date" type="datetime-local" value={detectedAt}
            onChange={e => setDetectedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
      </WizardStep>
    );
  }

  const intensityLabel = t(`celo.intensity.${intensity}` as const);
  return (
    <WizardStep current={3} total={3} title={t('celo.step3Title')}
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
        <p className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" aria-hidden /> {t('celo.summaryHeat')} {intensityLabel.toLowerCase()}</p>
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {detectedAt.replace('T', ' ')}</p>
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
