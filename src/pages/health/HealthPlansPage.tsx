/**
 * Esta pagina lista los planes sanitarios y permite crear o editar uno.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateHealthPlan, useHealthPlans } from '@/features/health/plans/api';
import { healthPlanCreateSchema, type HealthPlanCreateInput } from '@/features/health/plans/schemas';

/**
 * Listado de planes sanitarios. Marca planes globales con candado y permite crear nuevos.
 */
export default function HealthPlansPage() {
  const { t } = useTranslation(['health', 'common']);
  const list = useHealthPlans();
  const create = useCreateHealthPlan();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<HealthPlanCreateInput>({
    resolver: zodResolver(healthPlanCreateSchema),
    defaultValues: { appliesToPurpose: 'ANY', appliesToSex: 'ANY' }
  });

  const onSubmit = async (data: HealthPlanCreateInput) => {
    await create.mutateAsync(data);
    reset();
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('health:plan.title')}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />{t('health:plan.new')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('health:plan.new')}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register('description')} />
              </div>
              <div>
                <Label htmlFor="appliesToPurpose">{t('health:plan.appliesToPurpose')}</Label>
                <select
                  id="appliesToPurpose"
                  {...register('appliesToPurpose')}
                  className="w-full border rounded h-10 px-2 bg-background"
                >
                  {(['ANY', 'BEEF', 'DAIRY', 'DUAL'] as const).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="appliesToSex">{t('health:plan.appliesToSex')}</Label>
                <select
                  id="appliesToSex"
                  {...register('appliesToSex')}
                  className="w-full border rounded h-10 px-2 bg-background"
                >
                  {(['ANY', 'FEMALE', 'MALE'] as const).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={create.isPending}>{t('common:actions.save')}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full border rounded">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">{t('health:plan.appliesToPurpose')}</th>
            <th className="p-2 text-left">{t('health:plan.appliesToSex')}</th>
            <th className="p-2 w-12" />
          </tr>
        </thead>
        <tbody>
          {list.data?.map(p => (
            <tr key={p.id} className="border-t hover:bg-accent/40">
              <td className="p-2">
                <Link to={`/health/plans/${p.id}`} className="text-primary hover:underline">{p.name}</Link>
              </td>
              <td className="p-2">{p.appliesToPurpose}</td>
              <td className="p-2">{p.appliesToSex}</td>
              <td className="p-2 text-right">
                {p.accountId === null && (
                  <Lock className="h-4 w-4 inline text-muted-foreground" aria-label={t('health:plan.global')} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
