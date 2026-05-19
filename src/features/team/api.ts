/**
 * Este archivo contiene la api cliente del modulo team, con las funciones para llamar al backend y los hooks de react-query.
 */
import { http } from '@/lib/http';
import type { TeamUser, Invitation } from './types';
import type { InviteValues } from './schemas';
import type { UserRole } from '@/features/auth/types';

// Este objeto agrupa las llamadas al backend del modulo correspondiente.
export const teamApi = {
  listUsers: () => http.get<TeamUser[]>('/team').then(r => r.data),
  listInvitations: () => http.get<Invitation[]>('/team/invitations').then(r => r.data),
  invite: (v: InviteValues) => http.post<Invitation>('/team/invitations', v).then(r => r.data),
  deleteInvitation: (id: number) => http.delete(`/team/invitations/${id}`),
  updateUser: (id: number, body: { role?: UserRole; status?: 'ACTIVE' | 'DISABLED' }) =>
    http.patch<TeamUser>(`/team/users/${id}`, body).then(r => r.data)
};
