/**
 * Este componente es una pestana del detalle del modulo animals.
 */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnimalRoi } from '@/features/finance/animalRoi/api';

/** Tab Finanzas del detalle de animal: ROI + tabla de desglose. */
export function AnimalFinanceTab() {
  const { id } = useParams();
  const animalId = Number(id);
  const { t } = useTranslation(['finance', 'common']);
  const roi = useAnimalRoi(animalId);

  if (!roi.data) return <div>{t('common:loading')}</div>;
  const r = roi.data;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('finance:roi.totalIncome')}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{Number(r.totalIncome).toFixed(2)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('finance:roi.totalCost')}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{Number(r.totalCost).toFixed(2)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{t('finance:roi.roi')}</CardTitle></CardHeader>
          <CardContent className={`text-2xl font-bold ${Number(r.roi) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {Number(r.roi).toFixed(2)}
          </CardContent>
        </Card>
      </div>

      <section>
        <h3 className="font-semibold mb-2">{t('finance:roi.breakdown')}</h3>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">{t('finance:roi.breakdown')}</th>
              <th className="p-2 text-right">{t('finance:expense.amount')}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t"><td className="p-2">{t('finance:roi.treatments')}</td><td className="p-2 text-right">{Number(r.costs.treatments).toFixed(2)}</td></tr>
            <tr className="border-t"><td className="p-2">{t('finance:roi.vaccinationsIndividual')}</td><td className="p-2 text-right">{Number(r.costs.vaccinationsIndividual).toFixed(2)}</td></tr>
            <tr className="border-t"><td className="p-2">{t('finance:roi.vaccinationsProportionalLot')}</td><td className="p-2 text-right">{Number(r.costs.vaccinationsProportionalLot).toFixed(2)}</td></tr>
            <tr className="border-t"><td className="p-2">{t('finance:roi.services')}</td><td className="p-2 text-right">{Number(r.costs.services).toFixed(2)}</td></tr>
            <tr className="border-t"><td className="p-2">{t('finance:roi.manualExpenses')}</td><td className="p-2 text-right">{Number(r.costs.manualExpenses).toFixed(2)}</td></tr>
            <tr className="border-t"><td className="p-2">{t('finance:roi.feedingProportional')}</td><td className="p-2 text-right">{Number(r.costs.feedingProportional).toFixed(2)}</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
