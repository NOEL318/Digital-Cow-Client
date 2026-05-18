import { http } from '@/lib/http';

export interface AdminAccount { id: number; name: string; slug: string; status: string; plan: string; }

export const adminApi = {
  login: (email: string, password: string) =>
    http.post('/admin/login', { email, password }).then(r => r.data),
  listAccounts: () => http.get<AdminAccount[]>('/admin/accounts').then(r => r.data),
  updateAccount: (id: number, body: { status?: string; plan?: string }) =>
    http.patch<AdminAccount>(`/admin/accounts/${id}`, body).then(r => r.data)
};
