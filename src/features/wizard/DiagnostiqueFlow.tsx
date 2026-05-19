/**
 * Este wizard guia al usuario para registrar el diagnostico de una enfermedad.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Calendar, AlertTriangle, ShieldAlert, Flame } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { BigPicker } from '@/components/ui/big-picker';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useDiseases } from '@/features/catalog/api/diseases';
import { useCreateDiagnosis } from '@/features/health/diagnoses/api';
import { animalsApi } from '@/features/animals/api';
import i18n from '@/lib/i18n';
import { localizedName } from '@/lib/catalog';
import type { DiagnosisSeverity } from '@/features/health/diagnoses/types';

/** Wizard "Diagnostiqué". Pasos: ubicación+animal, enfermedad+severidad+fecha, confirmar. */
export function DiagnostiqueFlow() {
  const { t: tCommon } = useTranslation('common');
  const nav = useNavigate();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateDiagnosis();
  const diseases = useDiseases();
  const locale = i18n.language;

  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [diseaseId, setDiseaseId] = useState<number | null>(null);
  const [severity, setSeverity] = useState<DiagnosisSeverity>('MEDIUM');
  const [diagnosedAt, setDiagnosedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [symptoms, setSymptoms] = useState('');
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
    if (!ctx.animal || !diseaseId) return;
    try {
      await create.mutateAsync({
        animalId: ctx.animal.id,
        diseaseId,
        diagnosedAt,
        severity,
        symptoms: symptoms.trim() || undefined
      });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'No pudimos guardar el diagnóstico.');
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title="¿A cuál animal diagnosticaste?"
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title="¿Qué tiene?"
        subtitle="Elige la enfermedad y qué tan fuerte está."
        canAdvance={!!diseaseId && !!diagnosedAt}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <HelpfulField id="dx-disease" label="Enfermedad" icon={Stethoscope} required>
          <select id="dx-disease" value={diseaseId ?? ''}
            onChange={e => setDiseaseId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded-md px-3 py-3 text-base bg-background">
            <option value="">{tCommon("placeholder.selectDisease")}</option>
            {(diseases.data ?? []).map(d => (
              <option key={d.id} value={d.id}>{localizedName(d, locale)}</option>
            ))}
          </select>
        </HelpfulField>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Severidad</p>
          <BigPicker<DiagnosisSeverity>
            options={[
              { value: 'LOW', label: 'Leve', icon: AlertTriangle, description: 'Síntomas suaves.' },
              { value: 'MEDIUM', label: 'Media', icon: ShieldAlert, description: 'Necesita atención.' },
              { value: 'HIGH', label: 'Grave', icon: Flame, description: 'Urgente, vet.' }
            ]}
            value={severity}
            onChange={setSeverity}
            ariaLabel="Severidad del diagnóstico"
          />
        </div>

        <HelpfulField id="dx-date" label="Fecha" icon={Calendar} required>
          <input id="dx-date" type="date" value={diagnosedAt}
            onChange={e => setDiagnosedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>

        <HelpfulField id="dx-symptoms" label="Síntomas que ves" help="Una línea corta describiendo lo que observas." example="No quiere comer, ojos llorosos">
          <input id="dx-symptoms" value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
      </WizardStep>
    );
  }

  const disease = diseases.data?.find(d => d.id === diseaseId);
  const severityLabel = severity === 'LOW' ? 'Leve' : severity === 'HIGH' ? 'Grave' : 'Media';
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
        <p className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" aria-hidden /> {disease ? localizedName(disease, locale) : '-'}</p>
        <p className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-primary" aria-hidden /> {severityLabel}</p>
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {diagnosedAt}</p>
        {symptoms ? <p className="text-sm text-muted-foreground">Síntomas: {symptoms}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
