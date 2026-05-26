/**
 * Este wizard guia al usuario para registrar un gasto del rancho.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
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
  const { t } = useTranslation('wizard');
  const { t: tCommon } = useTranslation('common');
  const nav = useNavigate();
  const qc = useQueryClient();
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
      qc.invalidateQueries({ queryKey: ['finance', 'expenses'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'finance'] });
      qc.invalidateQueries({ queryKey: ['finance', 'pnl'] });
      qc.invalidateQueries({ queryKey: ['finance', 'cash-flow'] });
      nav('/inicio');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? t('gastar.saveFailed');
      setError(msg);
    }
  }

  if (step === 1) {
    return (
      <WizardStep
        current={1}
        total={2}
        title={t('gastar.step1Title')}
        subtitle={t('gastar.step1Subtitle')}
        canAdvance={!!categoryId && !!amount && Number(amount) > 0 && !!incurredAt}
        onNext={() => setStep(2)}
      >
        <HelpfulField id="g-cat" label={t('gastar.categoryLabel')} icon={Tags} required>
          <select
            id="g-cat"
            value={categoryId ?? ''}
            onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          >
            <option value="">{tCommon("placeholder.selectCategory")}</option>
            {(categories.data ?? []).map(c => (
              <option key={c.id} value={c.id}>{c.nameEs}</option>
            ))}
          </select>
        </HelpfulField>

        <HelpfulField id="g-amount" label={t('gastar.amountLabel')} icon={DollarSign} required example={t('gastar.amountExample')}>
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

        <HelpfulField id="g-date" label={t('gastar.dateLabel')} icon={Calendar} required>
          <input
            id="g-date"
            type="date"
            value={incurredAt}
            onChange={e => setIncurredAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField id="g-vendor" label={t('gastar.vendorLabel')} help={t('gastar.vendorHelp')} example={t('gastar.vendorExample')}>
          <input
            id="g-vendor"
            value={vendor}
            onChange={e => setVendor(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField id="g-desc" label={t('gastar.noteLabel')} help={t('gastar.noteHelp')} example={t('gastar.noteExample')}>
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
      title={t('gastar.step2Title')}
      canAdvance={!create.isPending}
      onNext={save}
      onBack={() => setStep(1)}
      isLast
    >
      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-2xl font-bold flex items-center gap-2"><MinusCircle className="h-6 w-6 text-destructive" aria-hidden /> {amount}</p>
        <p><span className="text-muted-foreground">{t('gastar.summaryCategory')}</span> {cat?.nameEs}</p>
        <p><span className="text-muted-foreground">{t('gastar.summaryDate')}</span> {incurredAt}</p>
        {vendor ? <p><span className="text-muted-foreground">{t('gastar.summaryVendor')}</span> {vendor}</p> : null}
        {description ? <p><span className="text-muted-foreground">{t('gastar.summaryNote')}</span> {description}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
