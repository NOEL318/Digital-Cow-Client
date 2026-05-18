import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">{t('reports:healthSummary.month')}</th>
              <th className="p-2 text-right">{t('reports:healthSummary.vaccinations')}</th>
              <th className="p-2 text-right">{t('reports:healthSummary.diagnosesMild')}</th>
              <th className="p-2 text-right">{t('reports:healthSummary.diagnosesModerate')}</th>
              <th className="p-2 text-right">{t('reports:healthSummary.diagnosesSevere')}</th>
              <th className="p-2 text-right">{t('reports:healthSummary.treatments')}</th>
              <th className="p-2 text-right">{t('reports:healthSummary.totalCost')}</th>
            </tr>
          </thead>
          <tbody>
            {summary.data.months.map(m => (
              <tr key={m.month} className="border-t">
                <td className="p-2">{m.month}</td>
                <td className="p-2 text-right">{m.vaccinations}</td>
                <td className="p-2 text-right">{m.diagnosesMild}</td>
                <td className="p-2 text-right">{m.diagnosesModerate}</td>
                <td className="p-2 text-right">{m.diagnosesSevere}</td>
                <td className="p-2 text-right">{m.treatments}</td>
                <td className="p-2 text-right">{Number(m.totalCost).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
