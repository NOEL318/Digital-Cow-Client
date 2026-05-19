/**
 * Este wizard guia al usuario para registrar la deteccion de un celo.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const nav = useNavigate();
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
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'No pudimos guardar el celo.');
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title="¿A cuál vaca le viste el celo?"
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} sexFilter="FEMALE" />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title="¿Cómo lo viste y qué tan fuerte?"
        canAdvance={!!detectedAt}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Intensidad</p>
          <BigPicker<Intensity>
            options={[
              { value: 'WEAK', label: 'Débil', icon: Sparkle, description: 'Señales suaves.' },
              { value: 'MODERATE', label: 'Normal', icon: Sparkles, description: 'Claro pero tranquilo.' },
              { value: 'STRONG', label: 'Fuerte', icon: Flame, description: 'Muy notorio.' }
            ]}
            value={intensity}
            onChange={setIntensity}
            ariaLabel="Intensidad del celo"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">¿Cómo lo detectaste?</p>
          <BigPicker<Method>
            options={[
              { value: 'VISUAL', label: 'A simple vista', icon: Eye },
              { value: 'PEDOMETER', label: 'Podómetro', icon: Activity },
              { value: 'HEAT_PATCH', label: 'Parche', icon: Thermometer },
              { value: 'CAMERA', label: 'Cámara', icon: Camera },
              { value: 'OTHER', label: 'Otro', icon: MoreHorizontal }
            ]}
            value={method}
            onChange={setMethod}
            ariaLabel="Método de detección"
          />
        </div>

        <HelpfulField id="celo-date" label="Cuándo lo viste" icon={Calendar} required>
          <input id="celo-date" type="datetime-local" value={detectedAt}
            onChange={e => setDetectedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
      </WizardStep>
    );
  }

  const intensityLabel = intensity === 'WEAK' ? 'Débil' : intensity === 'STRONG' ? 'Fuerte' : 'Normal';
  return (
    <WizardStep current={3} total={3} title="¿Listo? Así se guardará"
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
        <p className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" aria-hidden /> Celo {intensityLabel.toLowerCase()}</p>
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {detectedAt.replace('T', ' ')}</p>
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
