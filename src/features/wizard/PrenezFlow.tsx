/**
 * Este wizard guia al usuario para registrar un chequeo de prenez.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Baby, Calendar, Check, X, HelpCircle, Hand, Activity, Droplet, Milk } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { BigPicker } from '@/components/ui/big-picker';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useCreatePregnancyCheck } from '@/features/reproduction/pregnancyChecks/api';
import { animalsApi } from '@/features/animals/api';

type Result = 'POSITIVE' | 'NEGATIVE' | 'DOUBTFUL';
type Method = 'PALPATION' | 'ULTRASOUND' | 'BLOOD_TEST' | 'MILK_TEST';

/** Wizard "Detecté preñez". Pasos: hembra, resultado+método+fecha, confirmar. */
export function PrenezFlow() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreatePregnancyCheck();
  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [result, setResult] = useState<Result>('POSITIVE');
  const [method, setMethod] = useState<Method>('PALPATION');
  const [checkedAt, setCheckedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [gestationDays, setGestationDays] = useState('');
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

  const estimatedCalving = (result === 'POSITIVE' && checkedAt && gestationDays)
    ? new Date(new Date(checkedAt).getTime() + (283 - Number(gestationDays)) * 86400000).toISOString().slice(0, 10)
    : null;

  async function save() {
    setError(null);
    if (!ctx.animal) return;
    try {
      await create.mutateAsync({
        animalId: ctx.animal.id,
        result,
        method,
        checkedAt,
        estimatedGestationDays: result === 'POSITIVE' && gestationDays ? Number(gestationDays) : undefined
      });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'No pudimos guardar el chequeo.');
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title="¿A cuál vaca chequeaste?"
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} sexFilter="FEMALE" />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title="¿Qué resultado dio?"
        canAdvance={!!result && !!method && !!checkedAt}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Resultado</p>
          <BigPicker<Result>
            options={[
              { value: 'POSITIVE', label: 'Preñada', icon: Check, description: 'Está esperando.' },
              { value: 'NEGATIVE', label: 'Vacía', icon: X, description: 'No preñada.' },
              { value: 'DOUBTFUL', label: 'Dudoso', icon: HelpCircle, description: 'No claro.' }
            ]}
            value={result}
            onChange={setResult}
            ariaLabel="Resultado del chequeo"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">¿Cómo lo chequeaste?</p>
          <BigPicker<Method>
            options={[
              { value: 'PALPATION', label: 'Tacto', icon: Hand },
              { value: 'ULTRASOUND', label: 'Ecografía', icon: Activity },
              { value: 'BLOOD_TEST', label: 'Sangre', icon: Droplet },
              { value: 'MILK_TEST', label: 'Leche', icon: Milk }
            ]}
            value={method}
            onChange={setMethod}
            ariaLabel="Método del chequeo"
          />
        </div>

        <HelpfulField id="pc-date" label="Fecha del chequeo" icon={Calendar} required>
          <input id="pc-date" type="date" value={checkedAt}
            onChange={e => setCheckedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>

        {result === 'POSITIVE' ? (
          <HelpfulField id="pc-days" label="Días de gestación estimados" icon={Baby} example="60">
            <input id="pc-days" type="number" inputMode="numeric" min={1} max={300}
              value={gestationDays} onChange={e => setGestationDays(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-base bg-background" />
          </HelpfulField>
        ) : null}

        {estimatedCalving ? (
          <p className="text-xs text-muted-foreground">Parto estimado: <strong>{estimatedCalving}</strong></p>
        ) : null}
      </WizardStep>
    );
  }

  const resultLabel = result === 'POSITIVE' ? 'Preñada' : result === 'NEGATIVE' ? 'Vacía' : 'Dudoso';
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
        <p className="flex items-center gap-2 text-xl font-bold"><Baby className="h-5 w-5 text-primary" aria-hidden /> {resultLabel}</p>
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {checkedAt}</p>
        {estimatedCalving ? <p className="text-sm text-muted-foreground">Parto estimado: {estimatedCalving}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
