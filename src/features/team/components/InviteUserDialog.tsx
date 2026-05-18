import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { inviteSchema, type InviteValues } from '../schemas';
import { teamApi } from '../api';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function InviteUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation(['team', 'common']);
  const qc = useQueryClient();
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: 'WORKER' }
  });
  const m = useMutation({
    mutationFn: teamApi.invite,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invitations'] }); onClose(); }
  });

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent>
        <DialogTitle>{t('team:invite')}</DialogTitle>
        <form onSubmit={form.handleSubmit(v => m.mutate(v))} className="space-y-3">
          <div><Label>{t('team:fields.email')}</Label><Input type="email" {...form.register('email')} /></div>
          <div>
            <Label>{t('team:fields.role')}</Label>
            <select {...form.register('role')} className="w-full h-10 rounded-md border bg-background px-3">
              {(['OWNER', 'ADMIN', 'MANAGER', 'WORKER', 'VIEWER'] as const).map(r =>
                <option key={r} value={r}>{t(`team:roles.${r}`)}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>{t('common:actions.cancel')}</Button>
            <Button type="submit" disabled={m.isPending}>{t('common:actions.save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
