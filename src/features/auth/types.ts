/**
 * Este archivo define los tipos typescript del modulo auth compartidos por la api, los formularios y los componentes.
 */
export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'WORKER' | 'VIEWER' | 'SUPERADMIN';
export type Locale = 'es' | 'en';

export interface Me {
  id: number;
  accountId: number | null;
  email: string;
  fullName: string;
  role: UserRole;
  locale: Locale | null;
  emailVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}
