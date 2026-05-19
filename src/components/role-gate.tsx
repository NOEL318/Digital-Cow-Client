/**
 * Este archivo expone un componente que solo renderiza a sus hijos
 * cuando el rol del usuario actual aparece en la lista permitida.
 */
import { type ReactNode } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import type { UserRole } from '@/features/auth/types';

/** Muestra children solo si el rol del usuario coincide. */
export function RoleGate({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) return null;
  return <>{children}</>;
}
