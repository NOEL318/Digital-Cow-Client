/**
 * Esta pagina muestra el reporte de ganancias y perdidas del rancho.
 */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { usePnlReport } from '@/features/reports/pnlReport/api';
import type { PnlGroupBy } from '@/features/finance/pnl/api';
import { downloadCsv } from '@/lib/csv';

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getFullYear(), 0, 1);
  return { from: toIso(from), to: toIso(to) };
}

/** Pagina del reporte P&L con filtros, tabla y descarga CSV. */
export default function PnlReportPage() {
  const { t } = useTranslation(['reports', 'common']);
  const initial = useMemo(defaultRange, []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [groupBy, setGroupBy] = useState<PnlGroupBy>('month');
  const report = usePnlReport(from, to, groupBy);

  const handleDownload = () => {
    if (!report.data) return;
    const rows = report.data.buckets.map(b => ({
      key: b.key,
      label: b.label,
      income: Number(b.income).toFixed(2),
      expense: Number(b.expense).toFixed(2),
      margin: Number(b.margin).toFixed(2)
    }));
    downloadCsv(rows, `pnl-${from}-${to}.csv`);
  };

  const margin = report.data ? Number(report.data.margin) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reports:pnl.title')}</h1>
        <Button onClick={handleDownload} disabled={!report.data}>
          <Download className="h-4 w-4 mr-2" />{t('reports:actions.downloadCsv')}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-3 max-w-2xl">
        <div>
          <Label htmlFor="from">{t('reports:common.from')}</Label>
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="to">{t('reports:common.to')}</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="groupBy">{t('reports:common.groupBy')}</Label>
          <select
            id="groupBy"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as PnlGroupBy)}
            className="w-full border rounded h-10 px-2 bg-background"
          >
            <option value="month">{t('reports:common.groupByMonth')}</option>
            <option value="category">{t('reports:common.groupByCategory')}</option>
          </select>
        </div>
      </div>

      {report.data && (
        <>
          {/* KPI cards with semantic colors */}
          <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                  {t('reports:pnl.totalIncome')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold text-green-700 dark:text-green-400">
                {Number(report.data.totalIncome).toFixed(2)}
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
                  {t('reports:pnl.totalExpense')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold text-red-700 dark:text-red-400">
                {Number(report.data.totalExpense).toFixed(2)}
              </CardContent>
            </Card>
            <Card className={margin !== null && margin >= 0
              ? 'border-blue-200 dark:border-blue-800'
              : 'border-amber-200 dark:border-amber-800'}>
              <CardHeader>
                <CardTitle className={`text-sm font-medium ${margin !== null && margin >= 0
                  ? 'text-blue-700 dark:text-blue-400'
                  : 'text-amber-700 dark:text-amber-400'}`}>
                  {t('reports:pnl.margin')}
                </CardTitle>
              </CardHeader>
              <CardContent className={`text-2xl font-bold ${margin !== null && margin >= 0
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-amber-700 dark:text-amber-400'}`}>
                {Number(report.data.margin).toFixed(2)}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>{t('reports:pnl.importedCosts')}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>{t('reports:pnl.treatments')}: <span className="font-semibold text-red-700 dark:text-red-400">{Number(report.data.importedCosts.treatments).toFixed(2)}</span></div>
                <div>{t('reports:pnl.vaccinations')}: <span className="font-semibold text-red-700 dark:text-red-400">{Number(report.data.importedCosts.vaccinations).toFixed(2)}</span></div>
                <div>{t('reports:pnl.pestControls')}: <span className="font-semibold text-red-700 dark:text-red-400">{Number(report.data.importedCosts.pestControls).toFixed(2)}</span></div>
                <div>{t('reports:pnl.vetVisits')}: <span className="font-semibold text-red-700 dark:text-red-400">{Number(report.data.importedCosts.vetVisits).toFixed(2)}</span></div>
                <div>{t('reports:pnl.feedingRecords')}: <span className="font-semibold text-amber-700 dark:text-amber-400">{Number(report.data.importedCosts.feedingRecords).toFixed(2)}</span></div>
                <div>{t('reports:pnl.services')}: <span className="font-semibold text-amber-700 dark:text-amber-400">{Number(report.data.importedCosts.services).toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('reports:pnl.key')}</TableHead>
                <TableHead>{t('reports:pnl.label')}</TableHead>
                <TableHead className="text-right">{t('reports:pnl.income')}</TableHead>
                <TableHead className="text-right">{t('reports:pnl.expense')}</TableHead>
                <TableHead className="text-right">{t('reports:pnl.margin')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.data.buckets.map(b => {
                const bMargin = Number(b.margin);
                return (
                  <TableRow key={b.key}>
                    <TableCell>{b.key}</TableCell>
                    <TableCell>{b.label}</TableCell>
                    <TableCell className="text-right text-green-700 dark:text-green-400 font-medium">
                      {Number(b.income).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-red-700 dark:text-red-400 font-medium">
                      {Number(b.expense).toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${bMargin >= 0
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-amber-700 dark:text-amber-400'}`}>
                      {bMargin.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
