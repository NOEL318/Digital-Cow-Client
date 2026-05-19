/**
 * Este wizard guia al usuario para registrar un ordeno individual o por lote.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Milk, Calendar, Sun, Moon } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { BigPicker } from '@/components/ui/big-picker';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useCreateMilking } from '@/features/production/milkings/api';
import { animalsApi } from '@/features/animals/api';
import type { MilkingSession } from '@/features/production/milkings/types';

const COMMON_LITERS = [5, 8, 10, 12, 15, 20];

/**
 * Wizard "Ordene". Pasos: ubicacion+animal, sesion+litros, confirmar.
 * Soporta preseleccion via ?animalId=N para saltar al paso 2.
 */
export function OrdenarFlow() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateMilking();
  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [session, setSession] = useState<MilkingSession>('AM');
  const [liters, setLiters] = useState('');
  const [milkingDate, setMilkingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prefAnimalId || ctx.animal) return;
    animalsApi.get(prefAnimalId).then(a => {
      setCtx({
        ranchId: a.ranchId,
        lotId: a.lotId ?? null,
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
    if (!ctx.animal || !liters || Number(liters) <= 0) return;
    try {
      await create.mutateAsync({
        animalId: ctx.animal.id,
        milkingDate, session, liters: Number(liters)
      });
      nav('/inicio');
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'No pudimos guardar el ordeño.');
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title="¿A cuál vaca ordeñaste?" canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep
        current={2} total={3}
        title="¿Cuánta leche y cuándo?"
        subtitle="Toca un valor común o escribe el exacto."
        canAdvance={!!liters && Number(liters) > 0}
        onNext={() => setStep(3)}
        onBack={() => setStep(1)}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold">Sesión</p>
          <BigPicker<MilkingSession>
            options={[
              { value: 'AM', label: 'Mañana', icon: Sun, description: 'Ordeño matutino.' },
              { value: 'PM', label: 'Tarde', icon: Moon, description: 'Ordeño vespertino.' },
              { value: 'TOTAL', label: 'Total del día', icon: Milk, description: 'Suma de mañana y tarde.' }
            ]}
            value={session}
            onChange={setSession}
            ariaLabel="Sesión de ordeño"
          />
        </div>

        <HelpfulField id="m-liters" label="Litros" icon={Milk} required example="12.5">
          <div className="space-y-2">
            <input
              id="m-liters" type="number" inputMode="decimal" min={0} step={0.1}
              value={liters} onChange={e => setLiters(e.target.value)}
              className="w-full border rounded-md px-3 py-3 text-xl text-center bg-background font-bold"
              autoFocus
            />
            <div className="flex flex-wrap gap-2">
              {COMMON_LITERS.map(v => (
                <button key={v} type="button" onClick={() => setLiters(String(v))}
                  className="px-3 py-2 rounded-full border text-sm hover:bg-accent">
                  {v} litros
                </button>
              ))}
            </div>
          </div>
        </HelpfulField>

        <HelpfulField id="m-date" label="Fecha" icon={Calendar} required>
          <input id="m-date" type="date" value={milkingDate}
            onChange={e => setMilkingDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
      </WizardStep>
    );
  }

  const sessionLabel = session === 'AM' ? 'Mañana' : session === 'PM' ? 'Tarde' : 'Total del día';
  return (
    <WizardStep current={3} total={3} title="Listo? Así se guardará"
      canAdvance={!create.isPending} onNext={save} onBack={() => setStep(2)} isLast>
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <AnimalAvatar photoUrl={ctx.animal?.coverPhotoUrl}
            internalTag={ctx.animal?.internalTag ?? ''}
            name={ctx.animal?.name} size={64} />
          <div>
            <p className="font-bold text-lg">{ctx.animal?.internalTag}</p>
            {ctx.animal?.name ? <p className="text-sm text-muted-foreground">{ctx.animal.name}</p> : null}
          </div>
        </div>
        <p className="text-3xl font-bold flex items-center gap-2">
          <Milk className="h-7 w-7 text-primary" aria-hidden />
          {liters} litros
        </p>
        <p className="text-sm text-muted-foreground">{sessionLabel} · {milkingDate}</p>
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
