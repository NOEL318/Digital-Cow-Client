/**
 * Este archivo contiene el selector de idioma que persiste la preferencia
 * en el backend cuando el usuario tiene sesion iniciada.
 */
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { http } from '@/lib/http';

/** Cambia idioma. Si hay sesion, persiste en backend via PATCH /me. */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user, refreshMe } = useAuth();

  const change = async (lng: 'es' | 'en') => {
    await i18n.changeLanguage(lng);
    if (user) {
      await http.patch('/me', { locale: lng }).catch(() => {});
      await refreshMe();
    }
  };

  return (
    <div className="flex gap-1">
      <Button variant={i18n.language.startsWith('es') ? 'default' : 'ghost'} size="sm" onClick={() => change('es')}>ES</Button>
      <Button variant={i18n.language.startsWith('en') ? 'default' : 'ghost'} size="sm" onClick={() => change('en')}>EN</Button>
    </div>
  );
}
