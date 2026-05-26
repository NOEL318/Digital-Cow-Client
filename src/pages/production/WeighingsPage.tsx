/**
 * Esta pagina lista los pesajes registrados y permite agregar nuevos.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { useWeighings, useCreateWeighing, useBulkCreateWeighings } from '@/features/production/weighings/api';
import { WeighingForm } from '@/features/production/weighings/components/WeighingForm';
import { CsvImportDialog } from '@/features/csv-import/CsvImportDialog';
import type { WeighingCreate } from '@/features/production/weighings/types';

/**
 * Pagina de listado de pesajes con importacion masiva desde CSV
 * (columnas: animalId, weighedAt, weightKg, method, bodyConditionScore).
 */
export default function WeighingsPage() {
  const { t } = useTranslation(['production', 'common']);
  const weighings = useWeighings();
  const create = useCreateWeighing();
  const bulk = useBulkCreateWeighings();
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">{t('production:weighing.title')}</h1>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />{t('production:csvImport.importCsv')}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />{t('production:weighing.new')}</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{t('production:weighing.new')}</DialogTitle></DialogHeader>
              <WeighingForm
                submitting={create.isPending}
                onSubmit={async (data) => { await create.mutateAsync(data); setOpen(false); }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('production:weighing.weighedAt')}</TableHead>
            <TableHead>{t('production:weighing.animal')}</TableHead>
            <TableHead>{t('production:weighing.weightKg')}</TableHead>
            <TableHead>{t('production:weighing.method')}</TableHead>
            <TableHead>{t('production:weighing.bodyConditionScore')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {weighings.data?.map(w => (
            <TableRow key={w.id}>
              <TableCell>{w.weighedAt}</TableCell>
              <TableCell>{w.animalId}</TableCell>
              <TableCell>{w.weightKg}</TableCell>
              <TableCell>{w.method ? t(`production:weighing.methodValue.${w.method}`) : '-'}</TableCell>
              <TableCell>{w.bodyConditionScore ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CsvImportDialog<WeighingCreate>
        open={importOpen}
        title={t('production:csvImport.importWeighings')}
        columnsHelp={t('production:csvImport.weighingsHelp')}
        parseRow={(row) => {
          const animalId = Number(row.animalId);
          const weightKg = Number(row.weightKg);
          const weighedAt = row.weighedAt?.trim();
          if (!Number.isFinite(animalId) || animalId <= 0) return t('production:csvImport.invalidAnimalId');
          if (!Number.isFinite(weightKg) || weightKg <= 0) return t('production:csvImport.invalidWeightKg');
          if (!weighedAt || !/^\d{4}-\d{2}-\d{2}$/.test(weighedAt)) return t('production:csvImport.invalidWeighedAt');
          const bcs = row.bodyConditionScore ? Number(row.bodyConditionScore) : undefined;
          return {
            animalId,
            weighedAt,
            weightKg,
            method: (row.method as WeighingCreate['method']) || undefined,
            bodyConditionScore: Number.isFinite(bcs) ? bcs : undefined,
            notes: row.notes || undefined
          } as WeighingCreate;
        }}
        submit={async (items) => bulk.mutateAsync(items)}
        onClose={() => setImportOpen(false)}
      />
    </div>
  );
}
