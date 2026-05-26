/**
 * Esta pagina lista los tratamientos sanitarios aplicados a los animales.
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
import { useCreateTreatment, useTreatments } from '@/features/health/treatments/api';
import { TreatmentForm } from '@/features/health/treatments/components/TreatmentForm';
import { useMedications } from '@/features/catalog/api/medications';
import { localizedName } from '@/lib/catalog';

/**
 * Pagina de listado y creacion de tratamientos.
 */
export default function TreatmentsPage() {
  const { t } = useTranslation(['health', 'common']);
  const [open, setOpen] = useState(false);
  const list = useTreatments();
  const medications = useMedications();
  const create = useCreateTreatment();
  const locale = i18n.language;

  const medName = (id: number) => {
    const m = medications.data?.find(x => x.id === id);
    return m ? localizedName(m, locale) : '-';
  };

  const today = new Date().toISOString().slice(0, 10);

  const withdrawalBadge = (date: string | null | undefined) => {
    if (!date) return <span className="text-muted-foreground">-</span>;
    const isPast = date < today;
    return (
      <Badge tone={isPast ? 'success' : 'warning'}>
        {date}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('health:treatment.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('health:treatment.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('health:treatment.new')}</DialogTitle></DialogHeader>
            <TreatmentForm
              submitting={create.isPending}
              onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
            />
          </DialogContent>
        </Dialog>
      </div>
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
          {list.data?.map(tr => (
            <TableRow key={tr.id}>
              <TableCell>{tr.startedAt}</TableCell>
              <TableCell>{medName(tr.medicationId)}</TableCell>
              <TableCell>{withdrawalBadge(tr.withdrawalMilkUntil)}</TableCell>
              <TableCell>{withdrawalBadge(tr.withdrawalMeatUntil)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
