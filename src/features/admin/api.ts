/**
 * Este archivo contiene la api cliente del modulo admin, con las funciones para llamar al backend y los hooks de react-query.
 */
import { http } from '@/lib/http';

export interface AdminAccount { id: number; name: string; slug: string; status: string; plan: string; }

// Este objeto agrupa las llamadas al backend del modulo correspondiente.
export const adminApi = {
  login: (email: string, password: string) =>
    http.post('/admin/login', { email, password }).then(r => r.data),
  listAccounts: () => http.get<AdminAccount[]>('/admin/accounts').then(r => r.data),
  updateAccount: (id: number, body: { status?: string; plan?: string }) =>
    http.patch<AdminAccount>(`/admin/accounts/${id}`, body).then(r => r.data)
};
