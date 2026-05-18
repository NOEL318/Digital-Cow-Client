import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import i18n from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVaccines } from '@/features/catalog/api/vaccines';
import { localizedName } from '@/lib/catalog';
import { useCreatePlanStep, useUpdatePlanStep, useDeletePlanStep } from '../api';
import type { HealthPlanStep } from '../types';

interface Props {
  planId: number;
  steps: HealthPlanStep[];
  readOnly?: boolean;
}

/**
 * Lista de steps de un plan sanitario con reordenamiento (flechas) y CRUD.
 * Sin drag&drop para evitar dependencias adicionales.
 */
export function HealthPlanStepsList({ planId, steps, readOnly }: Props) {
  const { t } = useTranslation(['health', 'common']);
  const locale = i18n.language;
  const vaccines = useVaccines();
  const create = useCreatePlanStep(planId);
  const update = useUpdatePlanStep(planId);
  const del = useDeletePlanStep(planId);
  const [adding, setAdding] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftVaccineId, setDraftVaccineId] = useState<number | ''>('');
  const [draftAge, setDraftAge] = useState<number | ''>('');
  const [draftRec, setDraftRec] = useState<number | ''>('');

  const ordered = [...steps].sort((a, b) => a.stepOrder - b.stepOrder);

  const move = async (step: HealthPlanStep, dir: -1 | 1) => {
    const targetOrder = step.stepOrder + dir;
    const swap = ordered.find(s => s.stepOrder === targetOrder);
    if (!swap) return;
    await update.mutateAsync({ stepId: step.id, body: { stepOrder: targetOrder } });
    await update.mutateAsync({ stepId: swap.id, body: { stepOrder: step.stepOrder } });
  };

  const submitNew = async () => {
    if (!draftName) return;
    const nextOrder = (ordered[ordered.length - 1]?.stepOrder ?? 0) + 1;
    await create.mutateAsync({
      stepOrder: nextOrder,
      name: draftName,
      vaccineId: draftVaccineId === '' ? undefined : Number(draftVaccineId),
      ageMonthsMin: draftAge === '' ? undefined : Number(draftAge),
      recurrenceMonths: draftRec === '' ? undefined : Number(draftRec)
    });
    setDraftName('');
    setDraftVaccineId('');
    setDraftAge('');
    setDraftRec('');
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{t('health:plan.steps')}</h3>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted text-sm">
            <th className="p-2 text-left w-12">#</th>
            <th className="p-2 text-left">{t('health:vaccination.vaccine')}</th>
            <th className="p-2 text-left">{t('health:plan.ageMonthsMin')}</th>
            <th className="p-2 text-left">{t('health:plan.recurrenceMonths')}</th>
            <th className="p-2 w-32" />
          </tr>
        </thead>
        <tbody>
          {ordered.map((s, idx) => {
            const v = vaccines.data?.find(x => x.id === s.vaccineId);
            return (
              <tr key={s.id} className="border-t text-sm">
                <td className="p-2">{s.stepOrder}</td>
                <td className="p-2">{s.name} {v ? `(${localizedName(v, locale)})` : ''}</td>
                <td className="p-2">{s.ageMonthsMin ?? '-'}</td>
                <td className="p-2">{s.recurrenceMonths ?? '-'}</td>
                <td className="p-2 flex gap-1 justify-end">
                  {!readOnly && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => move(s, -1)} disabled={idx === 0}>
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => move(s, 1)}
                        disabled={idx === ordered.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => del.mutate(s.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!readOnly && (
        adding ? (
          <div className="border rounded p-3 space-y-2">
            <div>
              <Label>{t('health:vaccination.vaccine')}</Label>
              <select
                value={draftVaccineId}
                onChange={e => setDraftVaccineId(e.target.value ? Number(e.target.value) : '')}
                className="w-full border rounded h-10 px-2 bg-background"
              >
                <option value="">--</option>
                {vaccines.data?.map(v => (
                  <option key={v.id} value={v.id}>{localizedName(v, locale)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Name</Label>
              <Input value={draftName} onChange={e => setDraftName(e.target.value)} />
            </div>
            <div>
              <Label>{t('health:plan.ageMonthsMin')}</Label>
              <Input
                type="number"
                value={draftAge}
                onChange={e => setDraftAge(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
            <div>
              <Label>{t('health:plan.recurrenceMonths')}</Label>
              <Input
                type="number"
                value={draftRec}
                onChange={e => setDraftRec(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={submitNew} disabled={create.isPending}>{t('common:actions.save')}</Button>
              <Button variant="outline" onClick={() => setAdding(false)}>{t('common:actions.cancel')}</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />{t('health:plan.addStep')}
          </Button>
        )
      )}
    </div>
  );
}
