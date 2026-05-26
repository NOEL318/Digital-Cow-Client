/**
 * Esta pagina lista los diagnosticos registrados para los animales del rancho.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateDiagnosis, useDiagnoses } from '@/features/health/diagnoses/api';
import { DiagnosisForm } from '@/features/health/diagnoses/components/DiagnosisForm';
import { useDiseases } from '@/features/catalog/api/diseases';
import { localizedName } from '@/lib/catalog';

type SeverityTone = 'success' | 'warning' | 'danger' | 'neutral';
type StatusTone = 'danger' | 'success' | 'warning' | 'neutral';

const severityTone: Record<string, SeverityTone> = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger'
};

const statusTone: Record<string, StatusTone> = {
  ACTIVE: 'danger',
  RECOVERED: 'success',
  CHRONIC: 'warning',
  DECEASED: 'neutral'
};

const statusLabelKey: Record<string, 'health:diagnosis.status_active' | 'health:diagnosis.status_recovered' | 'health:diagnosis.status_chronic' | 'health:diagnosis.status_deceased'> = {
  ACTIVE: 'health:diagnosis.status_active',
  RECOVERED: 'health:diagnosis.status_recovered',
  CHRONIC: 'health:diagnosis.status_chronic',
  DECEASED: 'health:diagnosis.status_deceased'
};

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('health:diagnosis.diagnosedAt')}</TableHead>
            <TableHead>{t('health:diagnosis.disease')}</TableHead>
            <TableHead>{t('health:diagnosis.severity')}</TableHead>
            <TableHead>{t('health:diagnosis.status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.data?.map(d => (
            <TableRow key={d.id}>
              <TableCell>{d.diagnosedAt}</TableCell>
              <TableCell>{diseaseName(d.diseaseId)}</TableCell>
              <TableCell>
                <Badge tone={severityTone[d.severity] ?? 'neutral'}>
                  {d.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge tone={statusTone[d.status] ?? 'neutral'}>
                  {statusLabelKey[d.status] ? t(statusLabelKey[d.status]) : d.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
