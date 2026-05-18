import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const nav = useNavigate();
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
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'No pudimos guardar el parto.');
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title="¿Cuál vaca parió?"
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} sexFilter="FEMALE" />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title="¿Cómo fue el parto?"
        canAdvance={!!calvedAt}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <HelpfulField id="parto-date" label="Fecha del parto" icon={Calendar} required>
          <input id="parto-date" type="date" value={calvedAt}
            onChange={e => setCalvedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Dificultad</p>
          <BigPicker<Ease>
            options={[
              { value: 'FREE', label: 'Solita', icon: Smile, description: 'Sin ayuda.' },
              { value: 'EASY', label: 'Fácil', icon: Smile },
              { value: 'ASSISTED', label: 'Asistido', icon: HelpingHand },
              { value: 'DIFFICULT', label: 'Difícil', icon: Frown },
              { value: 'SURGERY', label: 'Cesárea', icon: Scissors }
            ]}
            value={ease}
            onChange={setEase}
            ariaLabel="Dificultad del parto"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Resultado</p>
          <BigPicker<Outcome>
            options={[
              { value: 'LIVE', label: 'Vivo', icon: Baby },
              { value: 'STILLBORN', label: 'Muerto', icon: Skull },
              { value: 'TWIN_LIVE', label: 'Mellizos vivos', icon: Baby },
              { value: 'TWIN_MIXED', label: 'Mellizos mixto', icon: HelpingHand },
              { value: 'TWIN_STILLBORN', label: 'Mellizos muertos', icon: Skull }
            ]}
            value={outcome}
            onChange={setOutcome}
            ariaLabel="Resultado del parto"
          />
        </div>

        {outcome !== 'STILLBORN' && outcome !== 'TWIN_STILLBORN' ? (
          <>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Sexo del becerro</p>
              <BigPicker<Sex>
                options={[
                  { value: 'FEMALE', label: 'Hembra' },
                  { value: 'MALE', label: 'Macho' }
                ]}
                value={calfSex ?? undefined}
                onChange={setCalfSex}
                ariaLabel="Sexo del becerro"
              />
            </div>

            <HelpfulField id="parto-w" label="Peso del becerro (kg)" example="35">
              <input id="parto-w" type="number" inputMode="decimal" min={0} step={0.1}
                value={weight} onChange={e => setWeight(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-base bg-background" />
            </HelpfulField>
          </>
        ) : null}
      </WizardStep>
    );
  }

  const easeLabel: Record<Ease, string> = {
    FREE: 'Solita', EASY: 'Fácil', ASSISTED: 'Asistido', DIFFICULT: 'Difícil', SURGERY: 'Cesárea'
  };
  const outcomeLabel: Record<Outcome, string> = {
    LIVE: 'Vivo', STILLBORN: 'Muerto', TWIN_LIVE: 'Mellizos vivos',
    TWIN_MIXED: 'Mellizos mixto', TWIN_STILLBORN: 'Mellizos muertos'
  };
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
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {calvedAt}</p>
        <p className="text-sm text-muted-foreground">Dificultad: {easeLabel[ease]}</p>
        <p className="text-sm text-muted-foreground">Resultado: {outcomeLabel[outcome]}</p>
        {calfSex ? <p className="text-sm text-muted-foreground">Becerro: {calfSex === 'FEMALE' ? 'hembra' : 'macho'}{weight ? ` · ${weight} kg` : ''}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
