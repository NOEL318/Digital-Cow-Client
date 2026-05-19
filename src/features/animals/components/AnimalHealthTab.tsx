/**
 * Este componente es una pestana del detalle del modulo animals.
 */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import i18n from '@/lib/i18n';
import { useAnimalVaccinations } from '@/features/health/vaccinations/api';
import { useAnimalDiagnoses } from '@/features/health/diagnoses/api';
import { useAnimalTreatments } from '@/features/health/treatments/api';

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
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">{t('health:vaccination.appliedAt')}</th>
              <th className="p-2 text-left">{t('health:vaccination.vaccine')}</th>
              <th className="p-2 text-left">{t('health:vaccination.nextDose')}</th>
            </tr>
          </thead>
          <tbody>
            {vaccinations.data?.map(v => (
              <tr key={v.id} className="border-t">
                <td className="p-2">{v.appliedAt}</td>
                <td className="p-2">{pickName(v.vaccineNameEn, v.vaccineNameEs, v.vaccineId)}</td>
                <td className="p-2">{v.nextDoseDue ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3 className="font-semibold mb-2">{t('health:diagnosis.title')}</h3>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">{t('health:diagnosis.diagnosedAt')}</th>
              <th className="p-2 text-left">{t('health:diagnosis.disease')}</th>
              <th className="p-2 text-left">{t('health:diagnosis.status')}</th>
            </tr>
          </thead>
          <tbody>
            {diagnoses.data?.map(d => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.diagnosedAt}</td>
                <td className="p-2">{pickName(d.diseaseNameEn, d.diseaseNameEs, d.diseaseId)}</td>
                <td className="p-2">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3 className="font-semibold mb-2">{t('health:treatment.title')}</h3>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-left">{t('health:treatment.startedAt')}</th>
              <th className="p-2 text-left">{t('health:treatment.medication')}</th>
              <th className="p-2 text-left">{t('health:treatment.withdrawalMilk')}</th>
              <th className="p-2 text-left">{t('health:treatment.withdrawalMeat')}</th>
            </tr>
          </thead>
          <tbody>
            {treatments.data?.map(tr => (
              <tr key={tr.id} className="border-t">
                <td className="p-2">{tr.startedAt}</td>
                <td className="p-2">{pickName(tr.medicationNameEn, tr.medicationNameEs, tr.medicationId)}</td>
                <td className="p-2">{tr.withdrawalMilkUntil ?? '-'}</td>
                <td className="p-2">{tr.withdrawalMeatUntil ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
