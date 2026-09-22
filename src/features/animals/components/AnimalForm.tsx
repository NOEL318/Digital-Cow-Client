/**
 * Este componente contiene el formulario para crear o editar registros del modulo animals.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { animalSchema, type AnimalValues } from '../schemas';
import { breedsApi } from '@/features/breeds/api';
import type { AnimalResponse } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RanchPicker } from '@/components/ui/ranch-lot-picker';

interface Props { initial?: AnimalResponse; onSubmit: (v: AnimalValues) => Promise<void> | void; submitting?: boolean; }

/** Form reutilizable para crear o editar animal. */
export function AnimalForm({ initial, onSubmit, submitting }: Props) {
  const { t } = useTranslation(['animals', 'common']);
  const breeds = useQuery({ queryKey: ['breeds'], queryFn: breedsApi.list });
  const form = useForm<AnimalValues>({
    resolver: zodResolver(animalSchema),
    defaultValues: initial as AnimalValues | undefined ?? {
      ranchId: 0 as unknown as number, internalTag: '', sex: 'FEMALE', breedId: 0 as unknown as number,
      purpose: 'BEEF', status: 'ACTIVE', birthDateEstimated: false
    }
  });

  return (
    <form onSubmit={form.handleSubmit(async v => { await onSubmit(v); })} className="space-y-3 max-w-xl">
      <div><Label htmlFor="internalTag">{t('animals:fields.internalTag')}</Label><Input id="internalTag" {...form.register('internalTag')} /></div>
      <div><Label htmlFor="officialTag">{t('animals:fields.officialTag')}</Label><Input id="officialTag" {...form.register('officialTag')} /></div>
      <div><Label htmlFor="rfid">{t('animals:fields.rfid')}</Label><Input id="rfid" {...form.register('rfid')} /></div>
      <div><Label htmlFor="name">{t('animals:fields.name')}</Label><Input id="name" {...form.register('name')} /></div>
      <div>
        <Label htmlFor="sex">{t('animals:fields.sex')}</Label>
        <select id="sex" {...form.register('sex')} className="glass-input">
          {(['FEMALE','MALE'] as const).map(s => <option key={s} value={s}>{t(`animals:sex.${s}`)}</option>)}
        </select>
      </div>
      <div><Label htmlFor="birthDate">{t('animals:fields.birthDate')}</Label><Input id="birthDate" type="date" {...form.register('birthDate')} /></div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="bde" {...form.register('birthDateEstimated')} />
        <Label htmlFor="bde">{t('animals:fields.birthDateEstimated')}</Label>
      </div>
      <div>
        <Label htmlFor="breedId">{t('animals:fields.breed')}</Label>
        <select id="breedId" {...form.register('breedId')} className="glass-input">
          <option value="">-</option>
          {(breeds.data ?? []).map(b => <option key={b.id} value={b.id}>{b.nameEs}</option>)}
        </select>
      </div>
      <div>
        <Label>{t('animals:fields.ranch')}</Label>
        <RanchPicker
          value={form.watch('ranchId') || null}
          onChange={id => form.setValue('ranchId', (id ?? 0) as number, { shouldDirty: true })}
        />
      </div>
      <div>
        <Label htmlFor="purpose">{t('animals:fields.purpose')}</Label>
        <select id="purpose" {...form.register('purpose')} className="glass-input">
          {(['BEEF','DAIRY','DUAL'] as const).map(p => <option key={p} value={p}>{t(`animals:purpose.${p}`)}</option>)}
        </select>
      </div>
      <div>
        <Label htmlFor="status">{t('animals:fields.status')}</Label>
        <select id="status" {...form.register('status')} className="glass-input">
          {(['ACTIVE','SOLD','DEAD','MISSING','TRANSFERRED'] as const).map(s => <option key={s} value={s}>{t(`animals:status.${s}`)}</option>)}
        </select>
      </div>
      <div><Label htmlFor="notes">{t('animals:fields.notes')}</Label><Input id="notes" {...form.register('notes')} /></div>
      <Button type="submit" disabled={submitting}>{t('common:actions.save')}</Button>
    </form>
  );
}
