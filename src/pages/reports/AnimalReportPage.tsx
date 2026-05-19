/**
 * Esta pagina muestra el reporte detallado de un animal con todo su historial.
 */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
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
          <div>Tag: {r.animal.internalTag}</div>
          <div>Sex: {r.animal.sex}</div>
          <div>Purpose: {r.animal.purpose}</div>
          <div>Status: {r.animal.status}</div>
          <div>Birth: {r.animal.birthDate ?? '-'}</div>
          <div>Ranch: {r.animal.ranchName ?? `#${r.animal.ranchId}`}</div>
          <div>Lot: {r.animal.lotName ?? (r.animal.lotId != null ? `#${r.animal.lotId}` : '-')}</div>
          <div>Breed: {pick(r.animal.breedNameEn, r.animal.breedNameEs, r.animal.breedId)}</div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">{t('reports:animal.vaccinations')}</h2>
        <table className="w-full border rounded">
          <thead><tr className="bg-muted"><th className="p-2 text-left">Fecha</th><th className="p-2 text-left">Vacuna</th><th className="p-2 text-right">Costo</th></tr></thead>
          <tbody>
            {r.vaccinations.map(v => (
              <tr key={v.id} className="border-t">
                <td className="p-2">{v.appliedAt}</td>
                <td className="p-2">{pick(v.vaccineNameEn, v.vaccineNameEs)}</td>
                <td className="p-2 text-right">{v.cost ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-semibold mb-2">{t('reports:animal.diagnoses')}</h2>
        <table className="w-full border rounded">
          <thead><tr className="bg-muted"><th className="p-2 text-left">Fecha</th><th className="p-2 text-left">Enfermedad</th><th className="p-2 text-left">Severidad</th><th className="p-2 text-left">Estado</th></tr></thead>
          <tbody>
            {r.diagnoses.map(d => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.diagnosedAt}</td>
                <td className="p-2">{pick(d.diseaseNameEn, d.diseaseNameEs)}</td>
                <td className="p-2">{d.severity ?? '-'}</td>
                <td className="p-2">{d.status ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-semibold mb-2">{t('reports:animal.treatments')}</h2>
        <table className="w-full border rounded">
          <thead><tr className="bg-muted"><th className="p-2 text-left">Inicio</th><th className="p-2 text-left">Medicamento</th><th className="p-2 text-right">Costo</th></tr></thead>
          <tbody>
            {r.treatments.map(tr => (
              <tr key={tr.id} className="border-t">
                <td className="p-2">{tr.startedAt}</td>
                <td className="p-2">{pick(tr.medicationNameEn, tr.medicationNameEs)}</td>
                <td className="p-2 text-right">{tr.cost ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-semibold mb-2">{t('reports:animal.weighings')}</h2>
        <table className="w-full border rounded">
          <thead><tr className="bg-muted"><th className="p-2 text-left">Fecha</th><th className="p-2 text-right">Peso (kg)</th></tr></thead>
          <tbody>
            {r.weighings.map(w => (
              <tr key={w.id} className="border-t">
                <td className="p-2">{w.weighedAt}</td>
                <td className="p-2 text-right">{w.weightKg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {r.milkings.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">{t('reports:animal.milkings')}</h2>
          <table className="w-full border rounded">
            <thead><tr className="bg-muted"><th className="p-2 text-left">Fecha</th><th className="p-2 text-right">Litros</th></tr></thead>
            <tbody>
              {r.milkings.map(m => (
                <tr key={m.id} className="border-t">
                  <td className="p-2">{m.milkedAt}</td>
                  <td className="p-2 text-right">{m.liters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {r.calvings.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">{t('reports:animal.calvings')}</h2>
          <table className="w-full border rounded">
            <thead><tr className="bg-muted"><th className="p-2 text-left">Fecha</th><th className="p-2 text-left">Resultado</th></tr></thead>
            <tbody>
              {r.calvings.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.calvingDate}</td>
                  <td className="p-2">{c.outcome ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {r.sale && (
        <section className="border rounded p-4">
          <h2 className="font-semibold mb-2">{t('reports:animal.sale')}</h2>
          <div className="text-sm">
            <div>Fecha: {r.sale.soldAt}</div>
            <div>Comprador: {r.sale.buyer ?? '-'}</div>
            <div>Total: {Number(r.sale.totalPrice).toFixed(2)}</div>
          </div>
        </section>
      )}
    </div>
  );
}
