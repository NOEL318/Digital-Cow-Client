/**
 * Esta pagina permite gestionar los miembros del equipo del rancho, invitarlos y asignar roles.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { teamApi } from '@/features/team/api';
import { InviteUserDialog } from '@/features/team/components/InviteUserDialog';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/features/auth/types';

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

      <table className="w-full text-sm border">
        <thead><tr className="border-b"><th className="p-2 text-left">Email</th><th>Nombre</th><th>Rol</th><th>Status</th></tr></thead>
        <tbody>
          {(users.data ?? []).map(u => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.email}</td><td>{u.fullName}</td>
              <td>
                <select value={u.role} onChange={e => update.mutate({ id: u.id, role: e.target.value as UserRole })}
                  className="border rounded px-2 py-1 bg-background">
                  {(['OWNER','ADMIN','MANAGER','WORKER','VIEWER'] as const).map(r =>
                    <option key={r} value={r}>{t(`team:roles.${r}`)}</option>)}
                </select>
              </td>
              <td>
                <select value={u.status === 'INVITED' ? 'INVITED' : u.status}
                  onChange={e => update.mutate({ id: u.id, status: e.target.value as 'ACTIVE' | 'DISABLED' })}
                  className="border rounded px-2 py-1 bg-background">
                  <option value="ACTIVE">{t('team:status.ACTIVE')}</option>
                  <option value="DISABLED">{t('team:status.DISABLED')}</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h3 className="font-semibold mb-2">{t('team:pending')}</h3>
        <ul className="space-y-1">
          {(invs.data ?? []).map(i => (
            <li key={i.id} className="border rounded p-2 flex justify-between items-center">
              <span>{i.email} - {t(`team:roles.${i.role}`)}</span>
              <Button variant="ghost" size="sm" onClick={() => teamApi.deleteInvitation(i.id).then(() => qc.invalidateQueries({ queryKey: ['invitations'] }))}>
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
