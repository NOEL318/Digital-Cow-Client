/**
 * Esta pagina lista los pesajes registrados y permite agregar nuevos.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
            <Upload className="h-4 w-4 mr-2" />Importar CSV
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
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">{t('production:weighing.weighedAt')}</th>
            <th className="p-2 text-left">{t('production:weighing.animal')}</th>
            <th className="p-2 text-left">{t('production:weighing.weightKg')}</th>
            <th className="p-2 text-left">{t('production:weighing.method')}</th>
            <th className="p-2 text-left">{t('production:weighing.bodyConditionScore')}</th>
          </tr>
        </thead>
        <tbody>
          {weighings.data?.map(w => (
            <tr key={w.id} className="border-t">
              <td className="p-2">{w.weighedAt}</td>
              <td className="p-2">{w.animalId}</td>
              <td className="p-2">{w.weightKg}</td>
              <td className="p-2">{w.method ? t(`production:weighing.methodValue.${w.method}`) : '-'}</td>
              <td className="p-2">{w.bodyConditionScore ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <CsvImportDialog<WeighingCreate>
        open={importOpen}
        title="Importar pesajes desde CSV"
        columnsHelp="Columnas requeridas: animalId, weighedAt (YYYY-MM-DD), weightKg. Opcionales: method, bodyConditionScore, notes."
        parseRow={(row) => {
          const animalId = Number(row.animalId);
          const weightKg = Number(row.weightKg);
          const weighedAt = row.weighedAt?.trim();
          if (!Number.isFinite(animalId) || animalId <= 0) return 'animalId inválido';
          if (!Number.isFinite(weightKg) || weightKg <= 0) return 'weightKg inválido';
          if (!weighedAt || !/^\d{4}-\d{2}-\d{2}$/.test(weighedAt)) return 'weighedAt debe ser YYYY-MM-DD';
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
