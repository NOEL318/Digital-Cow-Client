import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
          <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('reports:pnl.totalIncome')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">{Number(report.data.totalIncome).toFixed(2)}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('reports:pnl.totalExpense')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">{Number(report.data.totalExpense).toFixed(2)}</CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('reports:pnl.margin')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-bold">{Number(report.data.margin).toFixed(2)}</CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>{t('reports:pnl.importedCosts')}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>{t('reports:pnl.treatments')}: <span className="font-semibold">{Number(report.data.importedCosts.treatments).toFixed(2)}</span></div>
                <div>{t('reports:pnl.vaccinations')}: <span className="font-semibold">{Number(report.data.importedCosts.vaccinations).toFixed(2)}</span></div>
                <div>{t('reports:pnl.pestControls')}: <span className="font-semibold">{Number(report.data.importedCosts.pestControls).toFixed(2)}</span></div>
                <div>{t('reports:pnl.vetVisits')}: <span className="font-semibold">{Number(report.data.importedCosts.vetVisits).toFixed(2)}</span></div>
                <div>{t('reports:pnl.feedingRecords')}: <span className="font-semibold">{Number(report.data.importedCosts.feedingRecords).toFixed(2)}</span></div>
                <div>{t('reports:pnl.services')}: <span className="font-semibold">{Number(report.data.importedCosts.services).toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>

          <table className="w-full border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">{t('reports:pnl.key')}</th>
                <th className="p-2 text-left">{t('reports:pnl.label')}</th>
                <th className="p-2 text-right">{t('reports:pnl.income')}</th>
                <th className="p-2 text-right">{t('reports:pnl.expense')}</th>
                <th className="p-2 text-right">{t('reports:pnl.margin')}</th>
              </tr>
            </thead>
            <tbody>
              {report.data.buckets.map(b => (
                <tr key={b.key} className="border-t">
                  <td className="p-2">{b.key}</td>
                  <td className="p-2">{b.label}</td>
                  <td className="p-2 text-right">{Number(b.income).toFixed(2)}</td>
                  <td className="p-2 text-right">{Number(b.expense).toFixed(2)}</td>
                  <td className="p-2 text-right">{Number(b.margin).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
