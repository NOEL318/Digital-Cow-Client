import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
  const nav = useNavigate();
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

  // Auto-select first ranch when there's only one and user reaches step 3
  if (step === 3 && ranchId === null && ranches.data && ranches.data.length === 1) {
    setRanchId(ranches.data[0].id);
  }

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
      nav('/animales');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'No pudimos guardar el animal. Revisa los datos.';
      setError(msg);
    }
  }

  if (step === 1) {
    return (
      <WizardStep
        current={1}
        total={4}
        title="Como se llama este animal?"
        subtitle="Pon una marca corta (la que usas en el rancho) y opcionalmente un nombre."
        canAdvance={!!internalTag.trim() && !!breedId}
        onNext={() => setStep(2)}
      >
        <HelpfulField id="ca-tag" label="Marca del animal" icon={Tag} required example="ESM-042" help="Asi lo encuentras rapido en listas.">
          <input
            id="ca-tag"
            value={internalTag}
            onChange={e => setInternalTag(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
            autoFocus
          />
        </HelpfulField>
        <HelpfulField id="ca-name" label="Nombre" help="Si tiene uno. Es opcional." example="Estrella">
          <input
            id="ca-name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>
        <HelpfulField id="ca-breed" label="Raza" required>
          <select
            id="ca-breed"
            value={breedId ?? ''}
            onChange={e => setBreedId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          >
            <option value="">Elige la raza</option>
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
        title="Es hembra o macho?"
        subtitle="Y para que se usa el animal."
        canAdvance={!!sex && !!purpose}
        onNext={() => setStep(3)}
        onBack={() => setStep(1)}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold">Sexo</p>
          <BigPicker<Sex>
            options={[
              { value: 'FEMALE', label: 'Hembra' },
              { value: 'MALE', label: 'Macho' }
            ]}
            value={sex}
            onChange={setSex}
            ariaLabel="Sexo del animal"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Para que es?</p>
          <BigPicker<Purpose>
            options={[
              { value: 'BEEF', label: 'Carne', description: 'Para engorda y venta de carne.' },
              { value: 'DAIRY', label: 'Leche', description: 'Para produccion de leche.' },
              { value: 'DUAL', label: 'Doble proposito', description: 'Carne y leche.' }
            ]}
            value={purpose}
            onChange={setPurpose}
            ariaLabel="Proposito del animal"
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
        title="De donde viene?"
        subtitle="Elige el rancho. Si lo compraste, anota cuanto pagaste y a quien."
        canAdvance={!!ranchId}
        onNext={() => setStep(4)}
        onBack={() => setStep(2)}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold">Rancho donde va a vivir <span className="text-destructive">*</span></p>
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
            <span className="font-semibold">Si, lo compre y quiero registrar el gasto</span>
          </label>

          {isPurchase ? (
            <div className="space-y-3 pl-7">
              <HelpfulField id="ca-pdate" label="Fecha de compra" icon={Calendar}>
                <input
                  id="ca-pdate"
                  type="date"
                  value={purchasedAt}
                  onChange={e => setPurchasedAt(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-base bg-background"
                />
              </HelpfulField>
              <HelpfulField id="ca-price" label="Precio de compra" icon={DollarSign} example="18000">
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
              <HelpfulField id="ca-seller" label="Quien te lo vendio" icon={User} example="Don Manuel">
                <input
                  id="ca-seller"
                  value={seller}
                  onChange={e => setSeller(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-base bg-background"
                />
              </HelpfulField>
              <p className="text-xs text-muted-foreground">
                Se va a registrar como gasto en la categoria "Compra de animales" automaticamente.
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
      title="Listo? Asi se guardara"
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
        <p><span className="text-muted-foreground">Raza:</span> {breed?.nameEs}</p>
        <p><span className="text-muted-foreground">Sexo:</span> {sex === 'FEMALE' ? 'Hembra' : 'Macho'}</p>
        <p><span className="text-muted-foreground">Proposito:</span> {
          purpose === 'BEEF' ? 'Carne' : purpose === 'DAIRY' ? 'Leche' : 'Doble proposito'
        }</p>
        <p><span className="text-muted-foreground">Rancho:</span> {ranch?.name}</p>
        {isPurchase && purchasePrice ? (
          <p className="pt-2 border-t mt-2">
            <span className="text-muted-foreground">Gasto a registrar:</span> {purchasePrice}
            {seller ? <span className="text-muted-foreground"> ({seller})</span> : null}
          </p>
        ) : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
