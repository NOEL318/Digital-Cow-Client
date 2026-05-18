import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { localizedName } from '@/lib/catalog';
import { toArray } from '@/lib/page';
import { useIncomes, useCreateIncome, type IncomeFilters } from '@/features/finance/incomes/api';
import type { Income } from '@/features/finance/incomes/types';
import { useIncomeCategories } from '@/features/finance/categories/api';
import { IncomeForm } from '@/features/finance/incomes/components/IncomeForm';

/** Pagina de listado y creacion de ingresos. */
export default function IncomesPage() {
  const { t } = useTranslation(['finance', 'common']);
  const locale = i18n.language;
  const [filters, setFilters] = useState<IncomeFilters>({});
  const [open, setOpen] = useState(false);
  const incomes = useIncomes(filters);
  const categories = useIncomeCategories();
  const create = useCreateIncome();

  const categoryName = (id: number) => {
    const c = categories.data?.find(x => x.id === id);
    return c ? localizedName(c, locale) : '-';
  };

  const incomeRows = toArray<Income>(incomes.data);
  const total = incomeRows.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('finance:income.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('finance:income.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('finance:income.new')}</DialogTitle></DialogHeader>
            <IncomeForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-4 gap-3 max-w-4xl">
        <div>
          <Label htmlFor="from">{t('finance:expense.filterFrom')}</Label>
          <Input id="from" type="date" value={filters.from ?? ''} onChange={(e) => setFilters({ ...filters, from: e.target.value || undefined })} />
        </div>
        <div>
          <Label htmlFor="to">{t('finance:expense.filterTo')}</Label>
          <Input id="to" type="date" value={filters.to ?? ''} onChange={(e) => setFilters({ ...filters, to: e.target.value || undefined })} />
        </div>
        <div>
          <Label htmlFor="categoryId">{t('finance:income.category')}</Label>
          <select
            id="categoryId"
            value={filters.categoryId ?? ''}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            <option value="">--</option>
            {categories.data?.map(c => (
              <option key={c.id} value={c.id}>{localizedName(c, locale)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">{t('finance:income.total')}: <span className="font-semibold">{total.toFixed(2)}</span></div>

      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('finance:income.receivedAt')}</th>
            <th className="p-2 text-left">{t('finance:income.category')}</th>
            <th className="p-2 text-left">{t('finance:income.description')}</th>
            <th className="p-2 text-left">{t('finance:income.payer')}</th>
            <th className="p-2 text-left">{t('finance:income.sourceType')}</th>
            <th className="p-2 text-right">{t('finance:income.amount')}</th>
          </tr>
        </thead>
        <tbody>
          {incomeRows.map(i => (
            <tr key={i.id} className="border-t">
              <td className="p-2">{i.receivedAt}</td>
              <td className="p-2">{categoryName(i.incomeCategoryId)}</td>
              <td className="p-2">{i.description ?? '-'}</td>
              <td className="p-2">{i.payer ?? '-'}</td>
              <td className="p-2">{t(`finance:income.sourceTypeValue.${i.sourceType}`)}</td>
              <td className="p-2 text-right">{Number(i.amount).toFixed(2)} {i.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
