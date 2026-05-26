/**
 * Este componente es un dialogo modal del modulo ranches para una accion especifica.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { lotSchema, type LotValues } from '../schemas';
import { ranchApi } from '../api';
import type { Lot } from '../types';
import { LotPolygonPicker } from './LotPolygonPicker';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props { open: boolean; onClose: () => void; ranchId: number; lot?: Lot; }

/**
 * Dialog para crear o editar un lote. Incluye editor de polígono
 * en mapa (LotPolygonPicker): el usuario marca las esquinas del
 * corral tocando el mapa.
 */
export function LotFormDialog({ open, onClose, ranchId, lot }: Props) {
  const { t } = useTranslation(['ranches', 'common']);
  const qc = useQueryClient();
  const form = useForm<LotValues>({
    resolver: zodResolver(lotSchema),
    defaultValues: lot ?? { name: '', areaHectares: null, notes: '', polygon: null, centerLat: null, centerLng: null }
  });

  const m = useMutation({
    mutationFn: (v: LotValues) => lot ? ranchApi.updateLot(lot.id, v) : ranchApi.createLot(ranchId, v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ranches', ranchId, 'lots'] });
      qc.invalidateQueries({ queryKey: ['lots', ranchId] });
      onClose();
    }
  });

  const initialPolygon = lot?.polygon ?? null;
  const initialCenter = lot?.centerLat != null && lot?.centerLng != null
    ? { lat: Number(lot.centerLat), lng: Number(lot.centerLng) }
    : null;

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogTitle>{lot ? t('common:actions.edit') : t('ranches:lots.new')}</DialogTitle>
        <form onSubmit={form.handleSubmit(v => m.mutate(v))} className="space-y-3">
          <div>
            <Label>{t('ranches:lots.name')}</Label>
            <Input {...form.register('name')} />
          </div>
          <div>
            <Label>{t('ranches:fields.area')}</Label>
            <Input type="number" step="0.01" {...form.register('areaHectares')} />
          </div>
          <div>
            <Label>{t('ranches:fields.notes')}</Label>
            <Input {...form.register('notes')} />
          </div>
          <div>
            <Label>{t('ranches:lots.lotShapeLabel')}</Label>
            <LotPolygonPicker
              initialPolygon={initialPolygon}
              initialCenter={initialCenter}
              onChange={(polygon, center) => {
                form.setValue('polygon', polygon, { shouldDirty: true });
                form.setValue('centerLat', center?.lat ?? null, { shouldDirty: true });
                form.setValue('centerLng', center?.lng ?? null, { shouldDirty: true });
              }}
            />
          </div>
          <div className="flex justify-end gap-2 sticky bottom-0 bg-background pt-2">
            <Button type="button" variant="outline" onClick={onClose}>{t('common:actions.cancel')}</Button>
            <Button type="submit" disabled={m.isPending}>{t('common:actions.save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
