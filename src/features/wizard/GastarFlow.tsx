import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MinusCircle, Calendar, DollarSign, Tags } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { useExpenseCategories } from '@/features/finance/categories/api';
import { useCreateExpense } from '@/features/finance/expenses/api';

/**
 * Wizard "Gaste". Dos pasos: categoria y monto, confirmar. Sin paso de
 * animal para hacerlo rapido; el usuario puede asociar a animal desde
 * la tabla de gastos completa si lo necesita.
 */
export function GastarFlow() {
  const nav = useNavigate();
  const create = useCreateExpense();
  const categories = useExpenseCategories();
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [incurredAt, setIncurredAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    if (!categoryId || !amount) return;
    try {
      await create.mutateAsync({
        expenseCategoryId: categoryId,
        amount: Number(amount),
        incurredAt,
        vendor: vendor || undefined,
        description: description || undefined
      });
      nav('/inicio');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'No pudimos guardar el gasto.';
      setError(msg);
    }
  }

  if (step === 1) {
    return (
      <WizardStep
        current={1}
        total={2}
        title="En que gastaste?"
        subtitle="Elige una categoria, pon el monto y la fecha."
        canAdvance={!!categoryId && !!amount && Number(amount) > 0 && !!incurredAt}
        onNext={() => setStep(2)}
      >
        <HelpfulField id="g-cat" label="Categoria del gasto" icon={Tags} required>
          <select
            id="g-cat"
            value={categoryId ?? ''}
            onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          >
            <option value="">Elige una categoria</option>
            {(categories.data ?? []).map(c => (
              <option key={c.id} value={c.id}>{c.nameEs}</option>
            ))}
          </select>
        </HelpfulField>

        <HelpfulField id="g-amount" label="Cuanto dinero gastaste?" icon={DollarSign} required example="450">
          <input
            id="g-amount"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField id="g-date" label="Fecha del gasto" icon={Calendar} required>
          <input
            id="g-date"
            type="date"
            value={incurredAt}
            onChange={e => setIncurredAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField id="g-vendor" label="A quien le pagaste" help="Para acordarte donde lo compraste." example="Veterinaria El Toro">
          <input
            id="g-vendor"
            value={vendor}
            onChange={e => setVendor(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField id="g-desc" label="Nota corta" help="Para acordarte que era." example="Vacunas para los becerros nuevos">
          <input
            id="g-desc"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>
      </WizardStep>
    );
  }

  const cat = categories.data?.find(c => c.id === categoryId);
  return (
    <WizardStep
      current={2}
      total={2}
      title="Listo? Asi se guardara"
      canAdvance={!create.isPending}
      onNext={save}
      onBack={() => setStep(1)}
      isLast
    >
      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-2xl font-bold flex items-center gap-2"><MinusCircle className="h-6 w-6 text-destructive" aria-hidden /> {amount}</p>
        <p><span className="text-muted-foreground">Categoria:</span> {cat?.nameEs}</p>
        <p><span className="text-muted-foreground">Fecha:</span> {incurredAt}</p>
        {vendor ? <p><span className="text-muted-foreground">Pagado a:</span> {vendor}</p> : null}
        {description ? <p><span className="text-muted-foreground">Nota:</span> {description}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
