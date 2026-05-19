/**
 * Este archivo contiene el menu de usuario del navbar,
 * que muestra el nombre y permite cerrar sesion.
 */
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { useAuth } from '@/features/auth/AuthContext';

/** Menu de usuario en navbar: muestra nombre y logout. */
export function UserMenu() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { t } = useTranslation('common');
  if (!user) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">{user.fullName}</span>
      <Button variant="ghost" size="sm" onClick={async () => { await logout(); nav('/login'); }}>
        {t('nav.logout')}
      </Button>
    </div>
  );
}
