/**
 * Este archivo contiene el wrapper que protege rutas privadas y redirige
 * a la pagina de login cuando no hay un usuario autenticado.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/AuthContext';

/** Envuelve rutas privadas. Si no hay sesion, redirige a /login. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useTranslation('common');
  const loc = useLocation();
  if (loading) return <div className="p-8">{t('loading')}</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return <>{children}</>;
}
