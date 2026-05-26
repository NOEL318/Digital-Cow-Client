/**
 * Esta pagina lista las vacunaciones aplicadas y permite registrar nuevas en lote.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/toast';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  useCreateVaccination,
  useCreateVaccinationBulk,
  useVaccinations
} from '@/features/health/vaccinations/api';
import { VaccinationForm } from '@/features/health/vaccinations/components/VaccinationForm';
import { VaccinationBulkForm } from '@/features/health/vaccinations/components/VaccinationBulkForm';
import { useVaccines } from '@/features/catalog/api/vaccines';
import { localizedName } from '@/lib/catalog';

type Mode = 'individual' | 'bulk';

/**
 * Pagina de vacunaciones con tabs individual / por lote y tabla de recientes.
 */
export default function VaccinationsPage() {
  const { t } = useTranslation(['health', 'common']);
  const [mode, setMode] = useState<Mode>('individual');
  const toast = useToast();
  const locale = i18n.language;
  const list = useVaccinations();
  const vaccines = useVaccines();
  const createOne = useCreateVaccination();
  const createBulk = useCreateVaccinationBulk();

  const vaccineName = (id: number) => {
    const v = vaccines.data?.find(x => x.id === id);
    return v ? localizedName(v, locale) : '-';
  };

  const tabBtn = (m: Mode) =>
    `px-3 py-1 rounded ${mode === m ? 'bg-accent font-medium' : 'border'}`;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t('health:vaccination.title')}</h1>

      <div className="flex gap-2">
        <button type="button" className={tabBtn('individual')} onClick={() => setMode('individual')}>
          {t('health:vaccination.individual')}
        </button>
        <button type="button" className={tabBtn('bulk')} onClick={() => setMode('bulk')}>
          {t('health:vaccination.byLot')}
        </button>
      </div>

      <div className="border rounded p-4">
        {mode === 'individual' ? (
          <VaccinationForm
            submitting={createOne.isPending}
            onSubmit={async (data) => {
              await createOne.mutateAsync(data);
              toast.push(t('common:actions.save'));
            }}
          />
        ) : (
          <VaccinationBulkForm
            submitting={createBulk.isPending}
            onSubmit={async (data) => {
              const created = await createBulk.mutateAsync(data);
              toast.push(t('health:vaccination.expanded', { count: created.length }));
            }}
          />
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('health:vaccination.appliedAt')}</TableHead>
            <TableHead>{t('health:vaccination.vaccine')}</TableHead>
            <TableHead>{t('health:vaccination.batch')}</TableHead>
            <TableHead>{t('health:vaccination.nextDose')}</TableHead>
            <TableHead className="text-right">{t('health:vaccination.cost')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.data?.map(v => (
            <TableRow key={v.id}>
              <TableCell>{v.appliedAt}</TableCell>
              <TableCell>{vaccineName(v.vaccineId)}</TableCell>
              <TableCell>{v.batchNumber ?? '-'}</TableCell>
              <TableCell>{v.nextDoseDue ?? '-'}</TableCell>
              <TableCell className="text-right">{v.cost ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div>
        <Button variant="outline" onClick={() => list.refetch()}>{t('common:actions.search')}</Button>
      </div>
    </div>
  );
}
