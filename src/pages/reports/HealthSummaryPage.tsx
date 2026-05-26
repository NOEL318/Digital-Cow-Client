/**
 * Esta pagina muestra el resumen sanitario consolidado del rancho por periodo.
 */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { useHealthSummary } from '@/features/reports/healthSummary/api';
import { downloadCsv } from '@/lib/csv';

function toIso(d: Date): string { return d.toISOString().slice(0, 10); }

function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getFullYear(), 0, 1);
  return { from: toIso(from), to: toIso(to) };
}

/** Pagina del resumen mensual de eventos sanitarios con descarga CSV. */
export default function HealthSummaryPage() {
  const { t } = useTranslation(['reports', 'common']);
  const initial = useMemo(defaultRange, []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const summary = useHealthSummary(from, to);

  const handleDownload = () => {
    if (!summary.data) return;
    const rows = summary.data.months.map(m => ({
      month: m.month,
      vaccinations: m.vaccinations,
      diagnosesMild: m.diagnosesMild,
      diagnosesModerate: m.diagnosesModerate,
      diagnosesSevere: m.diagnosesSevere,
      treatments: m.treatments,
      totalCost: Number(m.totalCost).toFixed(2)
    }));
    downloadCsv(rows, `health-summary-${from}-${to}.csv`);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reports:healthSummary.title')}</h1>
        <Button onClick={handleDownload} disabled={!summary.data}>
          <Download className="h-4 w-4 mr-2" />{t('reports:actions.downloadCsv')}
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-3 max-w-xl">
        <div>
          <Label htmlFor="from">{t('reports:common.from')}</Label>
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="to">{t('reports:common.to')}</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>
      {summary.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('reports:healthSummary.month')}</TableHead>
              <TableHead className="text-right">{t('reports:healthSummary.vaccinations')}</TableHead>
              <TableHead className="text-right">{t('reports:healthSummary.diagnosesMild')}</TableHead>
              <TableHead className="text-right">{t('reports:healthSummary.diagnosesModerate')}</TableHead>
              <TableHead className="text-right">{t('reports:healthSummary.diagnosesSevere')}</TableHead>
              <TableHead className="text-right">{t('reports:healthSummary.treatments')}</TableHead>
              <TableHead className="text-right">{t('reports:healthSummary.totalCost')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.data.months.map(m => (
              <TableRow key={m.month}>
                <TableCell className="font-medium">{m.month}</TableCell>
                <TableCell className="text-right text-blue-700 dark:text-blue-400">{m.vaccinations}</TableCell>
                <TableCell className="text-right text-amber-600 dark:text-amber-400">{m.diagnosesMild}</TableCell>
                <TableCell className="text-right text-orange-600 dark:text-orange-400">{m.diagnosesModerate}</TableCell>
                <TableCell className="text-right text-red-700 dark:text-red-400 font-semibold">{m.diagnosesSevere}</TableCell>
                <TableCell className="text-right text-amber-700 dark:text-amber-400">{m.treatments}</TableCell>
                <TableCell className="text-right font-semibold text-red-700 dark:text-red-400">
                  {Number(m.totalCost).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
