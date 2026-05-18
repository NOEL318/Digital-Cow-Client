import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSalesHistory } from '@/features/reports/salesHistory/api';
import { downloadCsv } from '@/lib/csv';

function toIso(d: Date): string { return d.toISOString().slice(0, 10); }

function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getFullYear(), 0, 1);
  return { from: toIso(from), to: toIso(to) };
}

/** Pagina del histórico de ventas con descarga CSV. */
export default function SalesHistoryPage() {
  const { t } = useTranslation(['reports', 'common']);
  const initial = useMemo(defaultRange, []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const history = useSalesHistory(from, to);

  const handleDownload = () => {
    if (!history.data) return;
    const rows = history.data.rows.map(r => ({
      kind: r.kind,
      date: r.date,
      description: r.description ?? '',
      amount: Number(r.amount).toFixed(2),
      buyer: r.buyer ?? ''
    }));
    downloadCsv(rows, `sales-history-${from}-${to}.csv`);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reports:salesHistory.title')}</h1>
        <Button onClick={handleDownload} disabled={!history.data}>
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
      {history.data && (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">{t('reports:salesHistory.kind')}</th>
              <th className="p-2 text-left">{t('reports:salesHistory.date')}</th>
              <th className="p-2 text-left">{t('reports:salesHistory.description')}</th>
              <th className="p-2 text-left">{t('reports:salesHistory.buyer')}</th>
              <th className="p-2 text-right">{t('reports:salesHistory.amount')}</th>
            </tr>
          </thead>
          <tbody>
            {history.data.rows.map(r => (
              <tr key={`${r.kind}-${r.id}`} className="border-t">
                <td className="p-2">{r.kind === 'ANIMAL_SALE' ? t('reports:salesHistory.animalSale') : t('reports:salesHistory.milkSale')}</td>
                <td className="p-2">{r.date}</td>
                <td className="p-2">{r.description ?? '-'}</td>
                <td className="p-2">{r.buyer ?? '-'}</td>
                <td className="p-2 text-right">{Number(r.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
