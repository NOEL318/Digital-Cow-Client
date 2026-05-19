/**
 * Este archivo contiene la api cliente del modulo auth, con las funciones para llamar al backend y los hooks de react-query.
 */
import { http } from '@/lib/http';
import type { AuthTokens, Me } from './types';

/** Llamadas REST de auth. */
export const authApi = {
  login: (email: string, password: string) =>
    http.post<AuthTokens>('/auth/login', { email, password }).then(r => r.data),
  register: (payload: { accountName: string; fullName: string; email: string; password: string; locale: 'es' | 'en' }) =>
    http.post<AuthTokens>('/auth/register', payload).then(r => r.data),
  logout: (refreshToken: string) =>
    http.post<void>('/auth/logout', { refreshToken }).then(r => r.data),
  me: () => http.get<Me>('/me').then(r => r.data),
  verifyEmail: (token: string) =>
    http.post<void>('/auth/verify-email', { token }).then(r => r.data),
  requestPasswordReset: (email: string) =>
    http.post<void>('/auth/request-password-reset', { email }).then(r => r.data),
  resetPassword: (token: string, newPassword: string) =>
    http.post<void>('/auth/reset-password', { token, newPassword }).then(r => r.data)
};
