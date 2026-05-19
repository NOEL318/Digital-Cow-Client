/**
 * Esta pagina permite al administrador listar, suspender y reactivar cuentas tenant.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api';

/** Lista cuentas y permite cambiar status/plan. */
export default function AdminAccountsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['admin-accounts'], queryFn: adminApi.listAccounts });
  const m = useMutation({
    mutationFn: ({ id, status, plan }: { id: number; status?: string; plan?: string }) =>
      adminApi.updateAccount(id, { status, plan }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-accounts'] })
  });

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Accounts</h2>
      <table className="w-full text-sm border">
        <thead><tr className="border-b text-left"><th className="p-2">Name</th><th>Slug</th><th>Status</th><th>Plan</th></tr></thead>
        <tbody>
          {(q.data ?? []).map(a => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{a.name}</td><td>{a.slug}</td>
              <td>
                <select value={a.status} onChange={e => m.mutate({ id: a.id, status: e.target.value })} className="border rounded px-2 bg-background">
                  <option>ACTIVE</option><option>INACTIVE</option><option>SUSPENDED</option>
                </select>
              </td>
              <td>
                <select value={a.plan} onChange={e => m.mutate({ id: a.id, plan: e.target.value })} className="border rounded px-2 bg-background">
                  <option>FREE</option><option>PRO</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
