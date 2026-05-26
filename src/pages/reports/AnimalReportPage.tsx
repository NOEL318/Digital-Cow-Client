/**
 * Esta pagina muestra el reporte detallado de un animal con todo su historial.
 */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { useAnimalReport } from '@/features/reports/animalReport/api';

/**
 * Vista imprimible del reporte de un animal. La regla @media print en index.css
 * oculta sidebar/navbar al imprimir. El boton "Imprimir" dispara window.print().
 */
export default function AnimalReportPage() {
  const { id } = useParams<{ id: string }>();
  const animalId = Number(id);
  const { t } = useTranslation(['reports', 'common']);
  const locale = i18n.language;
  const report = useAnimalReport(animalId);

  const pick = (en?: string, es?: string, fallback?: number) =>
    locale.startsWith('en') ? (en ?? `#${fallback}`) : (es ?? `#${fallback}`);

  if (!report.data) return <div>{t('common:loading')}</div>;
  const r = report.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold">{t('reports:animal.title')}: {r.animal.internalTag}</h1>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" />{t('reports:actions.print')}
        </Button>
      </div>

      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">{t('reports:animal.info')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div>{t('reports:animal.colTag')}: <span className="font-medium">{r.animal.internalTag}</span></div>
          <div>{t('reports:animal.colSex')}: <span className="font-medium">{r.animal.sex}</span></div>
          <div>{t('reports:animal.colPurpose')}: <span className="font-medium">{r.animal.purpose}</span></div>
          <div>Status: <span className="font-medium">{r.animal.status}</span></div>
          <div>{t('reports:animal.colBirth')}: <span className="font-medium">{r.animal.birthDate ?? '-'}</span></div>
          <div>{t('reports:animal.colRanch')}: <span className="font-medium">{r.animal.ranchName ?? `#${r.animal.ranchId}`}</span></div>
          <div>{t('reports:animal.colLot')}: <span className="font-medium">{r.animal.lotName ?? (r.animal.lotId != null ? `#${r.animal.lotId}` : '-')}</span></div>
          <div>{t('reports:animal.colBreed')}: <span className="font-medium">{pick(r.animal.breedNameEn, r.animal.breedNameEs, r.animal.breedId)}</span></div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">{t('reports:animal.vaccinations')}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('reports:animal.colDate')}</TableHead>
              <TableHead>{t('reports:animal.colVaccine')}</TableHead>
              <TableHead className="text-right">{t('reports:animal.colCost')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {r.vaccinations.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.appliedAt}</TableCell>
                <TableCell>{pick(v.vaccineNameEn, v.vaccineNameEs)}</TableCell>
                <TableCell className="text-right text-red-700 dark:text-red-400">{v.cost ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="font-semibold mb-2">{t('reports:animal.diagnoses')}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('reports:animal.colDate')}</TableHead>
              <TableHead>{t('reports:animal.colDisease')}</TableHead>
              <TableHead>{t('reports:animal.colSeverity')}</TableHead>
              <TableHead>{t('reports:animal.colStatus')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {r.diagnoses.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.diagnosedAt}</TableCell>
                <TableCell>{pick(d.diseaseNameEn, d.diseaseNameEs)}</TableCell>
                <TableCell className={
                  d.severity === 'SEVERE' ? 'text-red-700 dark:text-red-400 font-semibold' :
                  d.severity === 'MODERATE' ? 'text-orange-600 dark:text-orange-400' :
                  'text-amber-600 dark:text-amber-400'
                }>{d.severity ?? '-'}</TableCell>
                <TableCell>{d.status ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="font-semibold mb-2">{t('reports:animal.treatments')}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('reports:animal.colStart')}</TableHead>
              <TableHead>{t('reports:animal.colMedication')}</TableHead>
              <TableHead className="text-right">{t('reports:animal.colCost')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {r.treatments.map(tr => (
              <TableRow key={tr.id}>
                <TableCell>{tr.startedAt}</TableCell>
                <TableCell>{pick(tr.medicationNameEn, tr.medicationNameEs)}</TableCell>
                <TableCell className="text-right text-red-700 dark:text-red-400">{tr.cost ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="font-semibold mb-2">{t('reports:animal.weighings')}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('reports:animal.colDate')}</TableHead>
              <TableHead className="text-right">{t('reports:animal.colWeightKg')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {r.weighings.map(w => (
              <TableRow key={w.id}>
                <TableCell>{w.weighedAt}</TableCell>
                <TableCell className="text-right font-medium text-blue-700 dark:text-blue-400">{w.weightKg}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {r.milkings.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">{t('reports:animal.milkings')}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('reports:animal.colDate')}</TableHead>
                <TableHead className="text-right">{t('reports:animal.colLiters')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {r.milkings.map(m => (
                <TableRow key={m.id}>
                  <TableCell>{m.milkedAt}</TableCell>
                  <TableCell className="text-right font-medium text-blue-700 dark:text-blue-400">{m.liters}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {r.calvings.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">{t('reports:animal.calvings')}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('reports:animal.colDate')}</TableHead>
                <TableHead>{t('reports:animal.colOutcome')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {r.calvings.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{c.calvingDate}</TableCell>
                  <TableCell>{c.outcome ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {r.sale && (
        <section className="border rounded p-4">
          <h2 className="font-semibold mb-2">{t('reports:animal.sale')}</h2>
          <div className="text-sm space-y-1">
            <div>{t('reports:animal.saleDate')}: <span className="font-medium">{r.sale.soldAt}</span></div>
            <div>{t('reports:animal.saleBuyer')}: <span className="font-medium">{r.sale.buyer ?? '-'}</span></div>
            <div>{t('reports:animal.saleTotal')}: <span className="font-semibold text-green-700 dark:text-green-400">{Number(r.sale.totalPrice).toFixed(2)}</span></div>
          </div>
        </section>
      )}
    </div>
  );
}
