/**
 * Este wizard guia al usuario para registrar el consumo de alimento de un lote.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Wheat, Calendar, Package } from 'lucide-react';
import { http } from '@/lib/http';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { WizardLocationSelector, type LocationContext } from './WizardLocationSelector';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { animalsApi } from '@/features/animals/api';

interface FeedItem { id: number; nameEs: string }
const COMMON_KG = [1, 2, 3, 5, 8, 10];

/** Wizard "Alimente" para un solo animal, con selector jerárquico. */
export function AlimentarAnimalFlow() {
  const { t } = useTranslation('wizard');
  const { t: tCommon } = useTranslation('common');
  const nav = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const prefAnimalId = params.get('animalId') ? Number(params.get('animalId')) : null;

  const [step, setStep] = useState(1);
  const [ctx, setCtx] = useState<LocationContext>({ ranchId: null, lotId: null, animal: null });
  const [feedItemId, setFeedItemId] = useState<number | null>(null);
  const [totalKg, setTotalKg] = useState('');
  const [consumedAt, setConsumedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const feedItems = useQuery({
    queryKey: ['feeding', 'items'],
    queryFn: async () => (await http.get<FeedItem[]>('/feeding/items')).data
  });

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
    if (!ctx.animal || !feedItemId || !totalKg) return;
    setSubmitting(true);
    try {
      await http.post('/feeding/records', {
        animalId: ctx.animal.id, feedItemId, consumedAt, totalKg: Number(totalKg)
      });
      qc.invalidateQueries({ queryKey: ['feeding', 'records'] });
      qc.invalidateQueries({ queryKey: ['feeding', 'cost-summary'] });
      qc.invalidateQueries({ queryKey: ['animal', ctx.animal.id] });
      nav(`/animales/${ctx.animal.id}`);
    } catch (e) {
      setError((e as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? t('alimentar.saveFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 1) {
    return (
      <WizardStep current={1} total={3} title={t('alimentar.step1Title')}
        subtitle={t('alimentar.step1Subtitle')}
        canAdvance={!!ctx.animal} onNext={() => setStep(2)}>
        <WizardLocationSelector value={ctx} onChange={setCtx} />
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep current={2} total={3} title={t('alimentar.step2Title')}
        canAdvance={!!feedItemId && !!totalKg && Number(totalKg) > 0}
        onNext={() => setStep(3)} onBack={() => setStep(1)}>
        <HelpfulField id="alim-item" label={t('alimentar.feedLabel')} icon={Package} required>
          <select id="alim-item" value={feedItemId ?? ''}
            onChange={e => setFeedItemId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background">
            <option value="">{tCommon("placeholder.selectFeed")}</option>
            {(feedItems.data ?? []).map(f => <option key={f.id} value={f.id}>{f.nameEs}</option>)}
          </select>
        </HelpfulField>
        <HelpfulField id="alim-kg" label={t('alimentar.kgLabel')} icon={Wheat} required example={t('alimentar.kgExample')}>
          <div className="space-y-2">
            <input id="alim-kg" type="number" inputMode="decimal" min={0} step={0.1}
              value={totalKg} onChange={e => setTotalKg(e.target.value)}
              className="w-full border rounded-md px-3 py-3 text-xl text-center bg-background font-bold" />
            <div className="flex flex-wrap gap-2">
              {COMMON_KG.map(v => (
                <button key={v} type="button" onClick={() => setTotalKg(String(v))}
                  className="px-3 py-2 rounded-full border text-sm hover:bg-accent">
                  {v} kg
                </button>
              ))}
            </div>
          </div>
        </HelpfulField>
        <HelpfulField id="alim-date" label={t('alimentar.dateLabel')} icon={Calendar} required>
          <input id="alim-date" type="date" value={consumedAt}
            onChange={e => setConsumedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background" />
        </HelpfulField>
      </WizardStep>
    );
  }

  const item = feedItems.data?.find(f => f.id === feedItemId);
  return (
    <WizardStep current={3} total={3} title={t('alimentar.step3Title')}
      canAdvance={!submitting} onNext={save} onBack={() => setStep(2)} isLast>
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <AnimalAvatar photoUrl={ctx.animal?.coverPhotoUrl}
            internalTag={ctx.animal?.internalTag ?? ''} name={ctx.animal?.name} size={64} />
          <div>
            <p className="font-bold text-lg">{ctx.animal?.internalTag}</p>
            {ctx.animal?.name ? <p className="text-sm text-muted-foreground">{ctx.animal.name}</p> : null}
          </div>
        </div>
        <p className="text-2xl font-bold flex items-center gap-2">
          <Wheat className="h-6 w-6 text-primary" aria-hidden />
          {totalKg} kg {t('alimentar.summaryOf')} {item?.nameEs}
        </p>
        <p className="text-sm text-muted-foreground">{consumedAt}</p>
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
