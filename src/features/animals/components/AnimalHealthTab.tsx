/**
 * Este componente es una pestana del detalle del modulo animals.
 */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import i18n from '@/lib/i18n';
import { useAnimalVaccinations } from '@/features/health/vaccinations/api';
import { useAnimalDiagnoses } from '@/features/health/diagnoses/api';
import { useAnimalTreatments } from '@/features/health/treatments/api';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

/**
 * Tab Salud del detalle de animal: vacunas, diagnosticos, tratamientos.
 * Si los nombres traducidos vienen del backend en el DTO los usa; si no, fallback al id.
 */
export function AnimalHealthTab() {
  const { id } = useParams();
  const animalId = Number(id);
  const { t } = useTranslation(['health', 'common']);
  const locale = i18n.language;

  const vaccinations = useAnimalVaccinations(animalId);
  const diagnoses = useAnimalDiagnoses(animalId);
  const treatments = useAnimalTreatments(animalId);

  const pickName = (en?: string, es?: string, id?: number) =>
    locale.startsWith('en') ? (en ?? `#${id}`) : (es ?? `#${id}`);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-semibold mb-2">{t('health:vaccination.title')}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('health:vaccination.appliedAt')}</TableHead>
              <TableHead>{t('health:vaccination.vaccine')}</TableHead>
              <TableHead>{t('health:vaccination.nextDose')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vaccinations.data?.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.appliedAt}</TableCell>
                <TableCell>{pickName(v.vaccineNameEn, v.vaccineNameEs, v.vaccineId)}</TableCell>
                <TableCell>{v.nextDoseDue ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h3 className="font-semibold mb-2">{t('health:diagnosis.title')}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('health:diagnosis.diagnosedAt')}</TableHead>
              <TableHead>{t('health:diagnosis.disease')}</TableHead>
              <TableHead>{t('health:diagnosis.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diagnoses.data?.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.diagnosedAt}</TableCell>
                <TableCell>{pickName(d.diseaseNameEn, d.diseaseNameEs, d.diseaseId)}</TableCell>
                <TableCell>
                  <Badge tone="info">{d.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h3 className="font-semibold mb-2">{t('health:treatment.title')}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('health:treatment.startedAt')}</TableHead>
              <TableHead>{t('health:treatment.medication')}</TableHead>
              <TableHead>{t('health:treatment.withdrawalMilk')}</TableHead>
              <TableHead>{t('health:treatment.withdrawalMeat')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.data?.map(tr => (
              <TableRow key={tr.id}>
                <TableCell>{tr.startedAt}</TableCell>
                <TableCell>{pickName(tr.medicationNameEn, tr.medicationNameEs, tr.medicationId)}</TableCell>
                <TableCell>{tr.withdrawalMilkUntil ?? '-'}</TableCell>
                <TableCell>{tr.withdrawalMeatUntil ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
