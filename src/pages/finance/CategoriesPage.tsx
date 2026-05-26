/**
 * Esta pagina permite gestionar las categorias de gastos e ingresos del rancho.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import { Plus, Lock } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { localizedName } from '@/lib/catalog';
import {
  useExpenseCategories, useCreateExpenseCategory,
  useIncomeCategories, useCreateIncomeCategory
} from '@/features/finance/categories/api';
import { ExpenseCategoryForm } from '@/features/finance/categories/components/ExpenseCategoryForm';
import { IncomeCategoryForm } from '@/features/finance/categories/components/IncomeCategoryForm';

/** Gestion del catalogo de categorias (egreso e ingreso) con candado para globales. */
export default function CategoriesPage() {
  const { t } = useTranslation(['finance', 'common']);
  const locale = i18n.language;
  const [openExp, setOpenExp] = useState(false);
  const [openInc, setOpenInc] = useState(false);
  const expCats = useExpenseCategories();
  const incCats = useIncomeCategories();
  const createExp = useCreateExpenseCategory();
  const createInc = useCreateIncomeCategory();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('finance:category.title')}</h1>

      <Tabs.Root defaultValue="expense" className="space-y-3">
        <Tabs.List className="flex gap-2 border-b">
          <Tabs.Trigger value="expense" className="px-3 py-1 data-[state=active]:border-b-2">
            {t('finance:category.expenseTab')}
          </Tabs.Trigger>
          <Tabs.Trigger value="income" className="px-3 py-1 data-[state=active]:border-b-2">
            {t('finance:category.incomeTab')}
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="expense" className="space-y-3">
          <div className="flex justify-end">
            <Dialog open={openExp} onOpenChange={setOpenExp}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />{t('finance:category.new')}</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{t('finance:category.new')}</DialogTitle></DialogHeader>
                <ExpenseCategoryForm
                  submitting={createExp.isPending}
                  onSubmit={async (data) => { await createExp.mutateAsync(data); setOpenExp(false); }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('finance:category.code')}</TableHead>
                <TableHead>{t('finance:category.nameEs')}</TableHead>
                <TableHead>{t('finance:category.kind')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expCats.data?.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="flex items-center gap-1">
                    {c.code}
                    {c.accountId === null && <Lock className="h-3 w-3 text-muted-foreground" aria-label={t('finance:category.global')} />}
                  </TableCell>
                  <TableCell>{localizedName(c, locale)}</TableCell>
                  <TableCell>{t(`finance:category.expenseKindValue.${c.kind}`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tabs.Content>

        <Tabs.Content value="income" className="space-y-3">
          <div className="flex justify-end">
            <Dialog open={openInc} onOpenChange={setOpenInc}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />{t('finance:category.new')}</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{t('finance:category.new')}</DialogTitle></DialogHeader>
                <IncomeCategoryForm
                  submitting={createInc.isPending}
                  onSubmit={async (data) => { await createInc.mutateAsync(data); setOpenInc(false); }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('finance:category.code')}</TableHead>
                <TableHead>{t('finance:category.nameEs')}</TableHead>
                <TableHead>{t('finance:category.kind')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incCats.data?.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="flex items-center gap-1">
                    {c.code}
                    {c.accountId === null && <Lock className="h-3 w-3 text-muted-foreground" aria-label={t('finance:category.global')} />}
                  </TableCell>
                  <TableCell>{localizedName(c, locale)}</TableCell>
                  <TableCell>{t(`finance:category.incomeKindValue.${c.kind}`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
