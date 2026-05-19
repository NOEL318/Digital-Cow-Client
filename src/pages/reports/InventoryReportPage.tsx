/**
 * Esta pagina muestra el reporte de inventario actual del rancho por categorias.
 */
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInventoryReport } from '@/features/reports/inventoryReport/api';
import { downloadCsv } from '@/lib/csv';

/** Pagina del reporte de inventario actual con descarga CSV. */
export default function InventoryReportPage() {
  const { t } = useTranslation(['reports', 'common']);
  const report = useInventoryReport();

  const handleDownload = () => {
    if (!report.data) return;
    const rows = report.data.rows.map(r => ({
      internalTag: r.internalTag,
      breed: r.breed ?? '',
      sex: r.sex,
      purpose: r.purpose,
      ageDays: r.ageDays ?? '',
      currentLot: r.currentLot ?? '',
      currentRanch: r.currentRanch ?? '',
      lastWeightKg: r.lastWeightKg ?? ''
    }));
    downloadCsv(rows, `inventory-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('reports:inventory.title')}</h1>
        <Button onClick={handleDownload} disabled={!report.data}>
          <Download className="h-4 w-4 mr-2" />{t('reports:actions.downloadCsv')}
        </Button>
      </div>
      {report.data && (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">{t('reports:inventory.internalTag')}</th>
              <th className="p-2 text-left">{t('reports:inventory.breed')}</th>
              <th className="p-2 text-left">{t('reports:inventory.sex')}</th>
              <th className="p-2 text-left">{t('reports:inventory.purpose')}</th>
              <th className="p-2 text-right">{t('reports:inventory.ageDays')}</th>
              <th className="p-2 text-left">{t('reports:inventory.currentLot')}</th>
              <th className="p-2 text-left">{t('reports:inventory.currentRanch')}</th>
              <th className="p-2 text-right">{t('reports:inventory.lastWeightKg')}</th>
            </tr>
          </thead>
          <tbody>
            {report.data.rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.internalTag}</td>
                <td className="p-2">{r.breed ?? '-'}</td>
                <td className="p-2">{r.sex}</td>
                <td className="p-2">{r.purpose}</td>
                <td className="p-2 text-right">{r.ageDays ?? '-'}</td>
                <td className="p-2">{r.currentLot ?? '-'}</td>
                <td className="p-2">{r.currentRanch ?? '-'}</td>
                <td className="p-2 text-right">{r.lastWeightKg ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
