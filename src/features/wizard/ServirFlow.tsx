/**
 * Este wizard guia al usuario para registrar un servicio reproductivo.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Droplet, Calendar, User, Beef, Heart } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { BigPicker } from '@/components/ui/big-picker';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { useBulls } from '@/features/reproduction/bulls/api';
import { useSemenStraws } from '@/features/reproduction/semen/api';
import { useCreateServiceEvent } from '@/features/reproduction/services/api';
import { animalsApi } from '@/features/animals/api';

type ServiceType = 'AI' | 'NATURAL' | 'EMBRYO_TRANSFER';

/** Wizard "Inseminé / Servicio". Pasos: hembra, tipo+toro/pajilla+fecha, confirmar. */
export function ServirFlow() {
  const { t } = useTranslation('wizard');
  const { t: tCommon } = useTranslation('common');
  const nav = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const create = useCreateServiceEvent();
  const bulls = useBulls();
  const straws = useSemenStraws();

  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [serviceType, setServiceType] = useState<ServiceType>('AI');
  const [bullId, setBullId] = useState<number | null>(null);
  const [strawId, setStrawId] = useState<number | null>(null);
  const [serviceDate, setServiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [technician, setTechnician] = useState('');
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

  const estimatedCalving = serviceDate
    ? new Date(new Date(serviceDate).getTime() + 283 * 86400000).toISOString().slice(0, 10)
    : null;

  const canAdvanceStep2 = serviceType === 'EMBRYO_TRANSFER'
    ? !!serviceDate
    : serviceType === 'AI'
      ? !!bullId && !!strawId && !!serviceDate
      : !!bullId && !!serviceDate;

  async function save() {
    setError(null);
    if (!ctx.animal) return;
    try {
      await create.mutateAsync({
        animalId: ctx.animal.id,
        serviceType,
        serviceDate,
        bullId: bullId ?? undefined,
        semenStrawId: serviceType === 'AI' ? strawId ?? undefined : undefined,
        technicianName: technician.trim() || undefined
      });
      qc.invalidateQueries({ queryKey: ['animal', ctx.animal.id] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'services'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'semen-straws'] });
      qc.invalidateQueries({ queryKey: ['reproduction', 'alerts'] });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? t('servir.saveFailed'));
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title={t('servir.step1Title')}
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} sexFilter="FEMALE" />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title={t('servir.step2Title')}
        subtitle={t('servir.step2Subtitle')}
        canAdvance={canAdvanceStep2}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('servir.typeLabel')}</p>
          <BigPicker<ServiceType>
            options={[
              { value: 'AI', label: t('servir.serviceType.AI'), icon: Droplet, description: t('servir.serviceTypeDesc.AI') },
              { value: 'NATURAL', label: t('servir.serviceType.NATURAL'), icon: Beef, description: t('servir.serviceTypeDesc.NATURAL') },
              { value: 'EMBRYO_TRANSFER', label: t('servir.serviceType.EMBRYO_TRANSFER'), icon: Heart, description: t('servir.serviceTypeDesc.EMBRYO_TRANSFER') }
            ]}
            value={serviceType}
            onChange={(tp) => { setServiceType(tp); setBullId(null); setStrawId(null); }}
            ariaLabel={t('servir.typeLabel')}
          />
        </div>

        {(serviceType === 'AI' || serviceType === 'NATURAL') ? (
          <HelpfulField id="srv-bull" label={t('servir.bullLabel')} icon={Beef} required>
            <select id="srv-bull" value={bullId ?? ''}
              onChange={e => setBullId(e.target.value ? Number(e.target.value) : null)}
              className="w-full border rounded-md px-3 py-3 text-base bg-background">
              <option value="">{tCommon("placeholder.selectBull")}</option>
              {(bulls.data ?? []).map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.internalCode})</option>
              ))}
            </select>
          </HelpfulField>
        ) : null}

        {serviceType === 'AI' ? (
          <HelpfulField id="srv-straw" label={t('servir.strawLabel')} icon={Droplet} required>
            <select id="srv-straw" value={strawId ?? ''}
              onChange={e => setStrawId(e.target.value ? Number(e.target.value) : null)}
              className="w-full border rounded-md px-3 py-3 text-base bg-background">
              <option value="">{tCommon("placeholder.selectSemen")}</option>
              {(straws.data ?? []).filter(s => s.availableQuantity > 0 && (!bullId || s.bullId === bullId)).map(s => (
                <option key={s.id} value={s.id}>
                  {s.batchNumber ?? `Pajilla #${s.id}`} ({s.availableQuantity} {t('servir.strawAvailable')})
                </option>
              ))}
            </select>
          </HelpfulField>
        ) : null}

        <HelpfulField id="srv-date" label={t('servir.dateLabel')} icon={Calendar} required>
          <input id="srv-date" type="date" value={serviceDate}
            onChange={e => setServiceDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>

        <HelpfulField id="srv-tech" label={t('servir.technicianLabel')} icon={User} help={t('servir.technicianHelp')}>
          <input id="srv-tech" value={technician}
            onChange={e => setTechnician(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>

        {estimatedCalving ? (
          <p className="text-xs text-muted-foreground">{t('servir.estimatedCalving')}<strong>{estimatedCalving}</strong></p>
        ) : null}
      </WizardStep>
    );
  }

  const typeLabel = t(`servir.serviceType.${serviceType}` as const);
  const bull = bulls.data?.find(b => b.id === bullId);
  const straw = straws.data?.find(s => s.id === strawId);
  return (
    <WizardStep current={3} total={3} title={t('servir.step3Title')}
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
        <p className="flex items-center gap-2"><Droplet className="h-4 w-4 text-primary" aria-hidden /> {typeLabel}</p>
        {bull ? <p className="flex items-center gap-2"><Beef className="h-4 w-4 text-primary" aria-hidden /> {bull.name} ({bull.internalCode})</p> : null}
        {straw ? <p className="text-sm text-muted-foreground">{t('servir.summaryStraw')}{straw.batchNumber ?? `#${straw.id}`}</p> : null}
        <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" aria-hidden /> {serviceDate}</p>
        {technician ? <p className="text-sm text-muted-foreground">{t('servir.summaryTechnician')}{technician}</p> : null}
        {estimatedCalving ? <p className="text-xs text-muted-foreground">{t('servir.summaryEstimatedCalving')}{estimatedCalving}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
