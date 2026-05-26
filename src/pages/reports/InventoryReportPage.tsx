/**
 * Esta pagina muestra el reporte de inventario actual del rancho por categorias.
 */
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('reports:inventory.internalTag')}</TableHead>
              <TableHead>{t('reports:inventory.breed')}</TableHead>
              <TableHead>{t('reports:inventory.sex')}</TableHead>
              <TableHead>{t('reports:inventory.purpose')}</TableHead>
              <TableHead className="text-right">{t('reports:inventory.ageDays')}</TableHead>
              <TableHead>{t('reports:inventory.currentLot')}</TableHead>
              <TableHead>{t('reports:inventory.currentRanch')}</TableHead>
              <TableHead className="text-right">{t('reports:inventory.lastWeightKg')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.data.rows.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.internalTag}</TableCell>
                <TableCell>{r.breed ?? '-'}</TableCell>
                <TableCell>{r.sex}</TableCell>
                <TableCell>{r.purpose}</TableCell>
                <TableCell className="text-right text-info">{r.ageDays ?? '-'}</TableCell>
                <TableCell>{r.currentLot ?? '-'}</TableCell>
                <TableCell>{r.currentRanch ?? '-'}</TableCell>
                <TableCell className="text-right font-medium text-info">{r.lastWeightKg ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
