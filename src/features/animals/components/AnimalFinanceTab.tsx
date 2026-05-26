/**
 * Este componente es una pestana del detalle del modulo animals.
 */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnimalRoi } from '@/features/finance/animalRoi/api';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('finance:roi.breakdown')}</TableHead>
              <TableHead className="text-right">{t('finance:expense.amount')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{t('finance:roi.treatments')}</TableCell>
              <TableCell className="text-right">{Number(r.costs.treatments).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('finance:roi.vaccinationsIndividual')}</TableCell>
              <TableCell className="text-right">{Number(r.costs.vaccinationsIndividual).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('finance:roi.vaccinationsProportionalLot')}</TableCell>
              <TableCell className="text-right">{Number(r.costs.vaccinationsProportionalLot).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('finance:roi.services')}</TableCell>
              <TableCell className="text-right">{Number(r.costs.services).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('finance:roi.manualExpenses')}</TableCell>
              <TableCell className="text-right">{Number(r.costs.manualExpenses).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('finance:roi.feedingProportional')}</TableCell>
              <TableCell className="text-right">{Number(r.costs.feedingProportional).toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
