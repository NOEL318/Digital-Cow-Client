/**
 * Esta pagina muestra el resumen financiero del rancho con sus principales indicadores.
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toArray } from '@/lib/page';
import { useCashFlow } from '@/features/finance/cashFlow/api';
import { usePnl } from '@/features/finance/pnl/api';
import { useIncomes } from '@/features/finance/incomes/api';
import { useExpenses } from '@/features/finance/expenses/api';

const COLORS = ['#0f766e', '#0369a1', '#a16207', '#7e22ce', '#be185d', '#374151', '#16a34a', '#dc2626'];

const MONTH_LABELS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTH_LABELS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Resumen financiero: cards YTD, BarChart 12 meses de cash flow,
 * PieChart de egresos por categoria YTD y tabla de ultimas 20 transacciones.
 */
export default function FinanceOverviewPage() {
  const { t } = useTranslation(['finance', 'common']);
  const locale = i18n.language;
  const monthLabels = locale.startsWith('en') ? MONTH_LABELS_EN : MONTH_LABELS_ES;

  const now = new Date();
  const year = now.getFullYear();
  const yearStart = `${year}-01-01`;
  const today = now.toISOString().slice(0, 10);

  const cashFlow = useCashFlow(year);
  const pnlByCategory = usePnl(yearStart, today, 'category');
  const lastIncomes = useIncomes({ size: 20, sort: 'receivedAt,desc' });
  const lastExpenses = useExpenses({ size: 20, sort: 'incurredAt,desc' });

  const cashChart = useMemo(() => {
    if (!cashFlow.data) return [];
    return cashFlow.data.months.map(m => ({
      month: monthLabels[m.month - 1] ?? String(m.month),
      income: Number(m.income),
      expense: Number(m.expense)
    }));
  }, [cashFlow.data, monthLabels]);

  const pieData = useMemo(() => {
    if (!pnlByCategory.data) return [];
    return pnlByCategory.data.buckets
      .filter(b => Number(b.expense) > 0)
      .map(b => ({ name: b.label, value: Number(b.expense) }));
  }, [pnlByCategory.data]);

  const recentTransactions = useMemo(() => {
    const incs = toArray<{
      id: number; receivedAt: string; amount: number | string;
      description?: string | null; incomeCategoryNameEs?: string; incomeCategoryNameEn?: string;
    }>(lastIncomes.data).map(i => ({
      kind: 'income' as const,
      id: `inc-${i.id}`,
      date: i.receivedAt,
      category: locale.startsWith('en') ? (i.incomeCategoryNameEn ?? '') : (i.incomeCategoryNameEs ?? ''),
      description: i.description ?? '',
      amount: Number(i.amount)
    }));
    const exps = toArray<{
      id: number; incurredAt: string; amount: number | string;
      description?: string | null; expenseCategoryNameEs?: string; expenseCategoryNameEn?: string;
    }>(lastExpenses.data).map(e => ({
      kind: 'expense' as const,
      id: `exp-${e.id}`,
      date: e.incurredAt,
      category: locale.startsWith('en') ? (e.expenseCategoryNameEn ?? '') : (e.expenseCategoryNameEs ?? ''),
      description: e.description ?? '',
      amount: Number(e.amount)
    }));
    return [...incs, ...exps]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, 20);
  }, [lastIncomes.data, lastExpenses.data, locale]);

  const totals = pnlByCategory.data;
  const margin = totals ? Number(totals.margin) : null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('finance:overview.title')}</h1>

      {/* KPI cards with semantic colors */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
              {t('finance:overview.ytdIncome')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-700 dark:text-green-400">
            {totals ? Number(totals.totalIncome).toFixed(2) : '-'}
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
              {t('finance:overview.ytdExpense')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-red-700 dark:text-red-400">
            {totals ? Number(totals.totalExpense).toFixed(2) : '-'}
          </CardContent>
        </Card>
        <Card className={margin !== null && margin >= 0
          ? 'border-blue-200 dark:border-blue-800'
          : 'border-amber-200 dark:border-amber-800'}>
          <CardHeader>
            <CardTitle className={`text-sm font-medium ${margin !== null && margin >= 0
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-amber-700 dark:text-amber-400'}`}>
              {t('finance:overview.ytdMargin')}
            </CardTitle>
          </CardHeader>
          <CardContent className={`text-2xl font-bold ${margin !== null && margin >= 0
            ? 'text-blue-700 dark:text-blue-400'
            : 'text-amber-700 dark:text-amber-400'}`}>
            {totals ? Number(totals.margin).toFixed(2) : '-'}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t('finance:overview.cashFlow')}</CardTitle></CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={cashChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" name={t('finance:overview.income')} fill="#16a34a" />
                <Bar dataKey="expense" name={t('finance:overview.expense')} fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('finance:overview.expensesByCategory')}</CardTitle></CardHeader>
          <CardContent style={{ height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={110}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('finance:overview.recentTransactions')}</CardTitle></CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('finance:overview.noTransactions')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('finance:overview.type')}</TableHead>
                  <TableHead>{t('finance:overview.date')}</TableHead>
                  <TableHead>{t('finance:overview.category')}</TableHead>
                  <TableHead>{t('finance:overview.description')}</TableHead>
                  <TableHead className="text-right">{t('finance:overview.amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Badge tone={r.kind === 'income' ? 'success' : 'danger'}>
                        {r.kind === 'income' ? t('finance:overview.income') : t('finance:overview.expense')}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell className={`text-right font-semibold ${r.kind === 'income' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {r.kind === 'income' ? '+' : '-'}{r.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
