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
import { useExpenses, useCreateExpense, type ExpenseFilters } from '@/features/finance/expenses/api';
import type { Expense } from '@/features/finance/expenses/types';
import { useExpenseCategories } from '@/features/finance/categories/api';
import { ExpenseForm } from '@/features/finance/expenses/components/ExpenseForm';

/** Pagina de listado y creacion de egresos manuales con filtros. */
export default function ExpensesPage() {
  const { t } = useTranslation(['finance', 'common']);
  const locale = i18n.language;
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [open, setOpen] = useState(false);
  const expenses = useExpenses(filters);
  const categories = useExpenseCategories();
  const create = useCreateExpense();

  const categoryName = (id: number) => {
    const c = categories.data?.find(x => x.id === id);
    return c ? localizedName(c, locale) : '-';
  };

  const expenseRows = toArray<Expense>(expenses.data);
  const total = expenseRows.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('finance:expense.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('finance:expense.new')}</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{t('finance:expense.new')}</DialogTitle></DialogHeader>
            <ExpenseForm
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
          <Label htmlFor="categoryId">{t('finance:expense.filterCategory')}</Label>
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

      <div className="text-sm text-muted-foreground">{t('finance:expense.total')}: <span className="font-semibold">{total.toFixed(2)}</span></div>

      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('finance:expense.incurredAt')}</th>
            <th className="p-2 text-left">{t('finance:expense.category')}</th>
            <th className="p-2 text-left">{t('finance:expense.description')}</th>
            <th className="p-2 text-left">{t('finance:expense.vendor')}</th>
            <th className="p-2 text-right">{t('finance:expense.amount')}</th>
          </tr>
        </thead>
        <tbody>
          {expenseRows.map(e => (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.incurredAt}</td>
              <td className="p-2">{categoryName(e.expenseCategoryId)}</td>
              <td className="p-2">{e.description ?? '-'}</td>
              <td className="p-2">{e.vendor ?? '-'}</td>
              <td className="p-2 text-right">{Number(e.amount).toFixed(2)} {e.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
