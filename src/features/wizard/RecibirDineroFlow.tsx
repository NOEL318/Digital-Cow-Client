/**
 * Este wizard guia al usuario para registrar un ingreso de dinero al rancho.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Calendar, DollarSign, Tags, User } from 'lucide-react';
import { WizardStep } from '@/components/ui/wizard-step';
import { HelpfulField } from '@/components/ui/helpful-field';
import { useIncomeCategories } from '@/features/finance/categories/api';
import { useCreateIncome } from '@/features/finance/incomes/api';

/**
 * Wizard "Recibi dinero". Dos pasos: categoria y monto, confirmar.
 */
export function RecibirDineroFlow() {
  const { t } = useTranslation('wizard');
  const { t: tCommon } = useTranslation('common');
  const nav = useNavigate();
  const qc = useQueryClient();
  const create = useCreateIncome();
  const categories = useIncomeCategories();
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [receivedAt, setReceivedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [payer, setPayer] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setError(null);
    if (!categoryId || !amount) return;
    try {
      await create.mutateAsync({
        incomeCategoryId: categoryId,
        amount: Number(amount),
        receivedAt,
        payer: payer || undefined,
        description: description || undefined
      });
      qc.invalidateQueries({ queryKey: ['finance', 'incomes'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'finance'] });
      qc.invalidateQueries({ queryKey: ['finance', 'pnl'] });
      qc.invalidateQueries({ queryKey: ['finance', 'cash-flow'] });
      nav('/inicio');
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? t('recibirDinero.saveFailed');
      setError(msg);
    }
  }

  if (step === 1) {
    return (
      <WizardStep
        current={1}
        total={2}
        title={t('recibirDinero.step1Title')}
        subtitle={t('recibirDinero.step1Subtitle')}
        canAdvance={!!categoryId && !!amount && Number(amount) > 0 && !!receivedAt}
        onNext={() => setStep(2)}
      >
        <HelpfulField id="i-cat" label={t('recibirDinero.categoryLabel')} icon={Tags} required>
          <select
            id="i-cat"
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

        <HelpfulField id="i-amount" label={t('recibirDinero.amountLabel')} icon={DollarSign} required example={t('recibirDinero.amountExample')}>
          <input
            id="i-amount"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField id="i-date" label={t('recibirDinero.dateLabel')} icon={Calendar} required>
          <input
            id="i-date"
            type="date"
            value={receivedAt}
            onChange={e => setReceivedAt(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField id="i-payer" label={t('recibirDinero.payerLabel')} icon={User} help={t('recibirDinero.payerHelp')} example={t('recibirDinero.payerExample')}>
          <input
            id="i-payer"
            value={payer}
            onChange={e => setPayer(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-base bg-background"
          />
        </HelpfulField>

        <HelpfulField id="i-desc" label={t('recibirDinero.noteLabel')} example={t('recibirDinero.noteExample')}>
          <input
            id="i-desc"
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
      title={t('recibirDinero.step2Title')}
      canAdvance={!create.isPending}
      onNext={save}
      onBack={() => setStep(1)}
      isLast
    >
      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-2xl font-bold flex items-center gap-2"><PlusCircle className="h-6 w-6 text-green-700" aria-hidden /> {amount}</p>
        <p><span className="text-muted-foreground">{t('recibirDinero.summaryCategory')}</span> {cat?.nameEs}</p>
        <p><span className="text-muted-foreground">{t('recibirDinero.summaryDate')}</span> {receivedAt}</p>
        {payer ? <p><span className="text-muted-foreground">{t('recibirDinero.summaryPayer')}</span> {payer}</p> : null}
        {description ? <p><span className="text-muted-foreground">{t('recibirDinero.summaryNote')}</span> {description}</p> : null}
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </WizardStep>
  );
}
