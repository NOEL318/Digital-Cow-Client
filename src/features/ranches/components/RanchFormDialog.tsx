/**
 * Este componente es un dialogo modal del modulo ranches para una accion especifica.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ranchSchema, type RanchValues } from '../schemas';
import { ranchApi } from '../api';
import type { Ranch } from '../types';
import { RanchLocationPicker } from './RanchLocationPicker';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props { open: boolean; onClose: () => void; ranch?: Ranch; }

/**
 * Dialog para crear o editar un rancho. Incluye selector de ubicacion
 * en mapa (RanchLocationPicker): el usuario toca el mapa o usa "mi
 * ubicacion" para fijar latitud y longitud sin escribirlas a mano.
 */
export function RanchFormDialog({ open, onClose, ranch }: Props) {
  const { t } = useTranslation(['ranches', 'common']);
  const qc = useQueryClient();
  const form = useForm<RanchValues>({
    resolver: zodResolver(ranchSchema),
    defaultValues: ranch ?? { name: '', location: '', latitude: null, longitude: null, areaHectares: null, notes: '' }
  });

  const m = useMutation({
    mutationFn: (v: RanchValues) => ranch ? ranchApi.update(ranch.id, v) : ranchApi.create(v),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ranches'] }); onClose(); }
  });

  const latitude = form.watch('latitude');
  const longitude = form.watch('longitude');
  const initial = latitude != null && longitude != null
    ? { lat: Number(latitude), lng: Number(longitude) }
    : null;

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogTitle>{ranch ? t('common:actions.edit') : t('ranches:new')}</DialogTitle>
        <form onSubmit={form.handleSubmit(v => m.mutate(v))} className="space-y-4">
          <div>
            <Label>{t('ranches:fields.name')}</Label>
            <Input {...form.register('name')} />
          </div>
          <div>
            <Label>{t('ranches:fields.location')}</Label>
            <Input
              {...form.register('location')}
              placeholder="Ejemplo: Carretera Federal kilómetro 12, El Llano"
            />
          </div>
          <div>
            <Label>Ubicación en el mapa</Label>
            <RanchLocationPicker
              initial={initial}
              onChange={({ lat, lng }) => {
                form.setValue('latitude', lat, { shouldDirty: true });
                form.setValue('longitude', lng, { shouldDirty: true });
              }}
            />
          </div>
          <div>
            <Label>{t('ranches:fields.area')}</Label>
            <Input type="number" step="0.01" {...form.register('areaHectares')} />
          </div>
          <div>
            <Label>{t('ranches:fields.notes')}</Label>
            <Input {...form.register('notes')} />
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
