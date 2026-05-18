import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Scale, Calendar } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useCreateWeighing } from '@/features/production/weighings/api';
import { animalsApi } from '@/features/animals/api';

const COMMON_WEIGHTS = [200, 300, 400, 500, 600];

/** Wizard "Pese" con selector jerárquico + presets de peso. */
export function PesarFlow() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateWeighing();
  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [weightKg, setWeightKg] = useState('');
  const [weighedAt, setWeighedAt] = useState(() => new Date().toISOString().slice(0, 10));
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
    if (!ctx.animal || !weightKg) return;
    try {
      await create.mutateAsync({
        animalId: ctx.animal.id,
        weightKg: Number(weightKg),
        weighedAt
      });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'No pudimos guardar el pesaje.');
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title="¿A cuál vaca pesaste?" canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title="¿Cuánto peso?" subtitle="Toca un valor común o escribe el exacto."
        canAdvance={!!weightKg && Number(weightKg) > 0}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <HelpfulField id="w-weight" label="Peso en kilogramos" icon={Scale} required example="420">
          <div className="space-y-2">
            <input id="w-weight" type="number" inputMode="decimal" min={0} step={0.1}
              value={weightKg} onChange={e => setWeightKg(e.target.value)}
              className="w-full border rounded-md px-3 py-3 text-xl text-center bg-background font-bold" autoFocus />
            <div className="flex flex-wrap gap-2">
              {COMMON_WEIGHTS.map(v => (
                <button key={v} type="button" onClick={() => setWeightKg(String(v))}
                  className="px-3 py-2 rounded-full border text-sm hover:bg-accent">
                  {v} kg
                </button>
              ))}
            </div>
          </div>
        </HelpfulField>
        <HelpfulField id="w-date" label="Fecha del pesaje" icon={Calendar} required>
          <input id="w-date" type="date" value={weighedAt} onChange={e => setWeighedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
      </WizardStep>
    );
  }

  return (
    <WizardStep current={3} total={3} title="Listo? Así se guardará"
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
        <p className="flex items-center gap-2 text-2xl font-bold">
          <Scale className="h-5 w-5 text-primary" aria-hidden /> {weightKg} kilogramos
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" aria-hidden /> {weighedAt}
        </p>
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
