/**
 * Este componente es un dialogo modal del modulo animals para una accion especifica.
 */
import { useState } from 'react';
import { Handshake, X, Calendar, DollarSign, Weight, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCreateAnimalSale } from '@/features/finance/animalSales/api';
import { BigButton } from '@/components/ui/big-button';
import { HelpfulField } from '@/components/ui/helpful-field';

interface SellAnimalDialogProps {
  open: boolean;
  animalId: number;
  internalTag: string;
  onClose: () => void;
  onSold?: () => void;
}

/**
 * Dialogo simple para vender un animal en un solo paso. Llama al
 * endpoint existente animal-sales que cambia el estado a SOLD y
 * crea el ingreso asociado en una sola transaccion del backend.
 */
export function SellAnimalDialog({ open, animalId, internalTag, onClose, onSold }: SellAnimalDialogProps) {
  const { t } = useTranslation('animals');
  const [soldAt, setSoldAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [buyer, setBuyer] = useState('');
  const [liveWeightKg, setLiveWeightKg] = useState<string>('');
  const [pricePerKg, setPricePerKg] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const create = useCreateAnimalSale();

  if (!open) return null;

  async function handleSubmit() {
    setError(null);
    const total = Number(totalPrice);
    if (!Number.isFinite(total) || total <= 0) {
      setError(t('sell.totalRequired'));
      return;
    }
    try {
      await create.mutateAsync({
        animalId,
        soldAt,
        liveWeightKg: liveWeightKg ? Number(liveWeightKg) : undefined,
        pricePerKg: pricePerKg ? Number(pricePerKg) : undefined,
        totalPrice: total,
        buyer: buyer || undefined
      });
      if (onSold) onSold();
      onClose();
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? t('sell.saveError');
      setError(msg);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('sell.title', { tag: internalTag })}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" aria-hidden />
            {t('sell.title', { tag: internalTag })}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('sell.close')}
            className="p-2 rounded-full hover:bg-accent"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <HelpfulField
          id="sell-date"
          label={t('sell.dateLabel')}
          help={t('sell.dateHelp')}
          icon={Calendar}
          required
        >
          <input
            id="sell-date"
            type="date"
            value={soldAt}
            onChange={e => setSoldAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField
          id="sell-buyer"
          label={t('sell.buyerLabel')}
          help={t('sell.buyerHelp')}
          icon={User}
          example={t('sell.buyerExample')}
        >
          <input
            id="sell-buyer"
            value={buyer}
            onChange={e => setBuyer(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField
          id="sell-weight"
          label={t('sell.weightLabel')}
          help={t('sell.weightHelp')}
          icon={Weight}
          example={t('sell.weightExample')}
        >
          <input
            id="sell-weight"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            value={liveWeightKg}
            onChange={e => setLiveWeightKg(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField
          id="sell-price-kg"
          label={t('sell.priceKgLabel')}
          help={t('sell.priceKgHelp')}
          icon={DollarSign}
          example={t('sell.priceKgExample')}
        >
          <input
            id="sell-price-kg"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={pricePerKg}
            onChange={e => setPricePerKg(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField
          id="sell-total"
          label={t('sell.totalLabel')}
          help={t('sell.totalHelp')}
          icon={DollarSign}
          example={t('sell.totalExample')}
          required
        >
          <input
            id="sell-total"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={totalPrice}
            onChange={e => setTotalPrice(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        {error ? (
          <p role="alert" className="text-sm text-destructive font-medium">
            {error}
          </p>
        ) : null}

        <div className="flex justify-between gap-3 pt-2">
          <BigButton label={t('sell.cancel')} variant="outline" onClick={onClose} />
          <BigButton
            label={t('sell.submit')}
            icon={Handshake}
            onClick={handleSubmit}
            disabled={create.isPending}
          />
        </div>
      </div>
    </div>
  );
}
