/**
 * Este wizard guia al usuario para registrar el destete de un ternero.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Calendar, Scale } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useCreateWeaning } from '@/features/reproduction/weanings/api';
import { animalsApi } from '@/features/animals/api';

/** Wizard "Desteté". Pasos: becerro, fecha+peso, confirmar. */
export function DestetarFlow() {
  const { t } = useTranslation('wizard');
  const nav = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateWeaning();
  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [weanedAt, setWeanedAt] = useState(() => new Date().toISOString().slice(0, 10));
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
        weanedAt,
        weightKg: weight ? Number(weight) : undefined
      });
      qc.invalidateQueries({ queryKey: ['animal', ctx.animal.id] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'weanings'] });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? t('destetar.saveFailed'));
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title={t('destetar.step1Title')}
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title={t('destetar.step2Title')}
        canAdvance={!!weanedAt}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <HelpfulField id="wn-date" label={t('destetar.dateLabel')} icon={Calendar} required>
          <input id="wn-date" type="date" value={weanedAt}
            onChange={e => setWeanedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
        <HelpfulField id="wn-weight" label={t('destetar.weightLabel')} icon={Scale} example={t('destetar.weightExample')}>
          <input id="wn-weight" type="number" inputMode="decimal" min={0} step={0.1}
            value={weight} onChange={e => setWeight(e.target.value)}
            className="w-full border rounded-md px-3 py-3 text-xl text-center bg-background font-bold" />
        </HelpfulField>
      </WizardStep>
    );
  }

  return (
    <WizardStep current={3} total={3} title={t('destetar.step3Title')}
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
        <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" aria-hidden /> {t('destetar.summaryWeaned')}</p>
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {weanedAt}</p>
        {weight ? <p className="flex items-center gap-2"><Scale className="h-4 w-4 text-primary" aria-hidden /> {weight} kg</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
