/**
 * Esta pagina lista los diagnosticos registrados para los animales del rancho.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateDiagnosis, useDiagnoses } from '@/features/health/diagnoses/api';
import { DiagnosisForm } from '@/features/health/diagnoses/components/DiagnosisForm';
import { useDiseases } from '@/features/catalog/api/diseases';
import { localizedName } from '@/lib/catalog';

/**
 * Pagina de listado y creacion de diagnosticos.
 */
export default function DiagnosesPage() {
  const { t } = useTranslation(['health', 'common']);
  const [open, setOpen] = useState(false);
  const list = useDiagnoses();
  const diseases = useDiseases();
  const create = useCreateDiagnosis();
  const locale = i18n.language;

  const diseaseName = (id: number) => {
    const d = diseases.data?.find(x => x.id === id);
    return d ? localizedName(d, locale) : '-';
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('health:diagnosis.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('health:diagnosis.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('health:diagnosis.new')}</DialogTitle></DialogHeader>
            <DiagnosisForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('health:diagnosis.diagnosedAt')}</th>
            <th className="p-2 text-left">{t('health:diagnosis.disease')}</th>
            <th className="p-2 text-left">{t('health:diagnosis.severity')}</th>
            <th className="p-2 text-left">{t('health:diagnosis.status')}</th>
          </tr>
        </thead>
        <tbody>
          {list.data?.map(d => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.diagnosedAt}</td>
              <td className="p-2">{diseaseName(d.diseaseId)}</td>
              <td className="p-2">{d.severity}</td>
              <td className="p-2">{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
