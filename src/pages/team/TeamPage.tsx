/**
 * Esta pagina permite gestionar los miembros del equipo del rancho, invitarlos y asignar roles.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { teamApi } from '@/features/team/api';
import { InviteUserDialog } from '@/features/team/components/InviteUserDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import type { UserRole } from '@/features/auth/types';

const STATUS_TONE = {
  ACTIVE: 'success',
  INVITED: 'info',
  DISABLED: 'neutral'
} as const;

/** Pagina de equipo: usuarios + invitaciones pendientes. */
export default function TeamPage() {
  const { t } = useTranslation(['team', 'common']);
  const users = useQuery({ queryKey: ['team-users'], queryFn: teamApi.listUsers });
  const invs = useQuery({ queryKey: ['invitations'], queryFn: teamApi.listInvitations });
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const update = useMutation({
    mutationFn: ({ id, role, status }: { id: number; role?: UserRole; status?: 'ACTIVE' | 'DISABLED' }) =>
      teamApi.updateUser(id, { role, status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team-users'] })
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t('team:title')}</h2>
        <Button onClick={() => setOpen(true)}>{t('team:invite')}</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('team:fields.email')}</TableHead>
            <TableHead>{t('team:fields.name')}</TableHead>
            <TableHead>{t('team:fields.role')}</TableHead>
            <TableHead>{t('team:fields.status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(users.data ?? []).map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.fullName}</TableCell>
              <TableCell>
                <select
                  value={u.role}
                  onChange={e => update.mutate({ id: u.id, role: e.target.value as UserRole })}
                  className="border rounded px-2 py-1 bg-background text-sm"
                >
                  {(['OWNER', 'ADMIN', 'MANAGER', 'WORKER', 'VIEWER'] as const).map(r =>
                    <option key={r} value={r}>{t(`team:roles.${r}`)}</option>
                  )}
                </select>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge tone={STATUS_TONE[u.status as keyof typeof STATUS_TONE] ?? 'neutral'}>
                    {t(`team:status.${u.status}`)}
                  </Badge>
                  {u.status !== 'INVITED' ? (
                    <select
                      value={u.status}
                      onChange={e => update.mutate({ id: u.id, status: e.target.value as 'ACTIVE' | 'DISABLED' })}
                      className="border rounded px-2 py-1 bg-background text-sm"
                    >
                      <option value="ACTIVE">{t('team:status.ACTIVE')}</option>
                      <option value="DISABLED">{t('team:status.DISABLED')}</option>
                    </select>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div>
        <h3 className="font-semibold mb-2">{t('team:pending')}</h3>
        <ul className="space-y-1">
          {(invs.data ?? []).map(i => (
            <li key={i.id} className="border rounded p-2 flex justify-between items-center">
              <span className="flex items-center gap-2">
                {i.email}
                <Badge tone="info">{t(`team:roles.${i.role}`)}</Badge>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => teamApi.deleteInvitation(i.id).then(() => {
                  qc.invalidateQueries({ queryKey: ['invitations'] });
                  qc.invalidateQueries({ queryKey: ['team-users'] });
                })}
              >
                {t('common:actions.delete')}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <InviteUserDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
