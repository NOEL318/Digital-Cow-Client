/**
 * Este wizard guia al usuario para registrar la compra de un animal nuevo.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { ShoppingCart, Calendar, DollarSign, User, Tag } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { BigPicker } from '@/components/ui/big-picker';
import { RanchPicker } from '@/components/ui/ranch-lot-picker';
import { useCreateAnimalWithPurchase } from '@/features/animals/purchase/api';
import { breedsApi } from '@/features/breeds/api';
import { ranchApi } from '@/features/ranches/api';

type Sex = 'FEMALE' | 'MALE';
type Purpose = 'BEEF' | 'DAIRY' | 'DUAL';

/**
 * Wizard "Compre animal". Cuatro pasos: identidad, sexo y proposito,
 * origen (rancho + opcionales de compra), confirmacion. Si el usuario
 * marca que es compra y pone precio, el endpoint atomico
 * /animals/with-purchase crea el animal y el gasto en una transaccion.
 */
export function ComprarAnimalFlow() {
  const { t } = useTranslation('wizard');
  const { t: tCommon } = useTranslation('common');
  const nav = useNavigate();
  const qc = useQueryClient();
  const create = useCreateAnimalWithPurchase();
  const breeds = useQuery({ queryKey: ['breeds'], queryFn: breedsApi.list });
  const ranches = useQuery({ queryKey: ['ranches'], queryFn: ranchApi.list });
  const [step, setStep] = useState(1);

  const [internalTag, setInternalTag] = useState('');
  const [name, setName] = useState('');
  const [breedId, setBreedId] = useState<number | null>(null);

  const [sex, setSex] = useState<Sex | null>(null);
  const [purpose, setPurpose] = useState<Purpose | null>(null);

  const [ranchId, setRanchId] = useState<number | null>(null);
  const [isPurchase, setIsPurchase] = useState(true);
  const [purchasedAt, setPurchasedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [purchasePrice, setPurchasePrice] = useState('');
  const [seller, setSeller] = useState('');

  const [error, setError] = useState<string | null>(null);

  // Selecciona el rancho cuando solo hay uno disponible.
  useEffect(() => {
    if (step === 3 && ranchId === null && ranches.data && ranches.data.length === 1) {
      setRanchId(ranches.data[0].id);
    }
  }, [step, ranchId, ranches.data]);

  async function save() {
    setError(null);
    if (!ranchId || !sex || !purpose || !breedId || !internalTag.trim()) return;
    try {
      await create.mutateAsync({
        animal: {
          ranchId,
          internalTag: internalTag.trim(),
          name: name.trim() || undefined,
          sex,
          purpose,
          breedId
        },
        purchasedAt: isPurchase ? purchasedAt : undefined,
        purchasePrice: isPurchase && purchasePrice ? Number(purchasePrice) : undefined,
        seller: isPurchase ? seller || undefined : undefined
      });
      qc.invalidateQueries({ queryKey: ['animals'] });
      qc.invalidateQueries({ queryKey: ['finance', 'expenses'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      nav('/animales');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? t('comprar.saveFailed');
      setError(msg);
    }
  }

  if (step === 1) {
    return (
      <WizardStep
        current={1}
        total={4}
        title={t('comprar.step1Title')}
        subtitle={t('comprar.step1Subtitle')}
        canAdvance={!!internalTag.trim() && !!breedId}
        onNext={() => setStep(2)}
      >
        <HelpfulField id="ca-tag" label={t('comprar.tagLabel')} icon={Tag} required example={t('comprar.tagExample')} help={t('comprar.tagHelp')}>
          <input
            id="ca-tag"
            value={internalTag}
            onChange={e => setInternalTag(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
            autoFocus
          />
        </HelpfulField>
        <HelpfulField id="ca-name" label={t('comprar.nameLabel')} help={t('comprar.nameHelp')} example={t('comprar.nameExample')}>
          <input
            id="ca-name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>
        <HelpfulField id="ca-breed" label={t('comprar.breedLabel')} required>
          <select
            id="ca-breed"
            value={breedId ?? ''}
            onChange={e => setBreedId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          >
            <option value="">{tCommon("placeholder.selectBreed")}</option>
            {(breeds.data ?? []).map(b => (
              <option key={b.id} value={b.id}>{b.nameEs}</option>
            ))}
          </select>
        </HelpfulField>
      </WizardStep>
    );
  }

  if (step === 2) {
    return (
      <WizardStep
        current={2}
        total={4}
        title={t('comprar.step2Title')}
        subtitle={t('comprar.step2Subtitle')}
        canAdvance={!!sex && !!purpose}
        onNext={() => setStep(3)}
        onBack={() => setStep(1)}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('comprar.sexLabel')}</p>
          <BigPicker<Sex>
            options={[
              { value: 'FEMALE', label: t('comprar.sex.FEMALE') },
              { value: 'MALE', label: t('comprar.sex.MALE') }
            ]}
            value={sex}
            onChange={setSex}
            ariaLabel={t('comprar.sexLabel')}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('comprar.purposeLabel')}</p>
          <BigPicker<Purpose>
            options={[
              { value: 'BEEF', label: t('comprar.purpose.BEEF'), description: t('comprar.purposeDesc.BEEF') },
              { value: 'DAIRY', label: t('comprar.purpose.DAIRY'), description: t('comprar.purposeDesc.DAIRY') },
              { value: 'DUAL', label: t('comprar.purpose.DUAL'), description: t('comprar.purposeDesc.DUAL') }
            ]}
            value={purpose}
            onChange={setPurpose}
            ariaLabel={t('comprar.purposeLabel')}
          />
        </div>
      </WizardStep>
    );
  }

  if (step === 3) {
    return (
      <WizardStep
        current={3}
        total={4}
        title={t('comprar.step3Title')}
        subtitle={t('comprar.step3Subtitle')}
        canAdvance={!!ranchId}
        onNext={() => setStep(4)}
        onBack={() => setStep(2)}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold">{t('comprar.ranchWhereLabel')} <span className="text-destructive">*</span></p>
          <RanchPicker value={ranchId} onChange={setRanchId} />
        </div>

        <div className="rounded-xl border p-3 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPurchase}
              onChange={e => setIsPurchase(e.target.checked)}
              className="h-5 w-5"
            />
            <span className="font-semibold">{t('comprar.purchaseCheck')}</span>
          </label>

          {isPurchase ? (
            <div className="space-y-3 pl-7">
              <HelpfulField id="ca-pdate" label={t('comprar.purchaseDateLabel')} icon={Calendar}>
                <input
                  id="ca-pdate"
                  type="date"
                  value={purchasedAt}
                  onChange={e => setPurchasedAt(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-base bg-background"
                />
              </HelpfulField>
              <HelpfulField id="ca-price" label={t('comprar.purchasePriceLabel')} icon={DollarSign} example={t('comprar.purchasePriceExample')}>
                <input
                  id="ca-price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.01}
                  value={purchasePrice}
                  onChange={e => setPurchasePrice(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-base bg-background"
                />
              </HelpfulField>
              <HelpfulField id="ca-seller" label={t('comprar.sellerLabel')} icon={User} example={t('comprar.sellerExample')}>
                <input
                  id="ca-seller"
                  value={seller}
                  onChange={e => setSeller(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-base bg-background"
                />
              </HelpfulField>
              <p className="text-xs text-muted-foreground">
                {t('comprar.purchaseNote')}
              </p>
            </div>
          ) : null}
        </div>
      </WizardStep>
    );
  }

  const ranch = ranches.data?.find(r => r.id === ranchId);
  const breed = breeds.data?.find(b => b.id === breedId);
  return (
    <WizardStep
      current={4}
      total={4}
      title={t('comprar.step4Title')}
      canAdvance={!create.isPending}
      onNext={save}
      onBack={() => setStep(3)}
      isLast
    >
      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-lg font-bold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" aria-hidden />
          {internalTag} {name ? `- ${name}` : ''}
        </p>
        <p><span className="text-muted-foreground">{t('comprar.summaryRace')}</span> {breed?.nameEs}</p>
        <p><span className="text-muted-foreground">{t('comprar.summarySex')}</span> {sex ? t(`comprar.sex.${sex}` as const) : ''}</p>
        <p><span className="text-muted-foreground">{t('comprar.summaryPurpose')}</span> {purpose ? t(`comprar.purpose.${purpose}` as const) : ''}</p>
        <p><span className="text-muted-foreground">{t('comprar.summaryRanch')}</span> {ranch?.name}</p>
        {isPurchase && purchasePrice ? (
          <p className="pt-2 border-t mt-2">
            <span className="text-muted-foreground">{t('comprar.summaryExpense')}</span> {purchasePrice}
            {seller ? <span className="text-muted-foreground"> ({seller})</span> : null}
          </p>
        ) : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
