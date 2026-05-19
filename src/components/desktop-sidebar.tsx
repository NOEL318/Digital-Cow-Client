/**
 * Este archivo define la barra lateral fija para escritorio
 * con accesos a Inicio, Animales y Ajustes.
 */
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Beef, Settings } from 'lucide-react';

/**
 * Sidebar lateral fija para escritorio. Tres destinos: Inicio (que
 * combina pendientes, captura y paneles), Animales, Ajustes.
 */
export function DesktopSidebar() {
  const { t } = useTranslation('common');
  const itemBase = 'flex items-center gap-3 px-3 py-2 rounded-md text-sm';
  const link = ({ isActive }: { isActive: boolean }) =>
    `${itemBase} ${isActive ? 'bg-accent font-semibold' : 'hover:bg-accent'}`;

  return (
    <aside
      className="hidden md:flex md:flex-col fixed inset-y-0 left-0 w-60 border-r bg-background p-3 gap-1 z-30 print:hidden"
      aria-label={t('nav.inicio')}
    >
      <div className="font-bold text-lg px-3 py-3">{t('appName')}</div>
      <NavLink to="/inicio" className={link} end>
        <Home className="h-5 w-5" aria-hidden />
        {t('nav.inicio')}
      </NavLink>
      <NavLink to="/animales" className={link}>
        <Beef className="h-5 w-5" aria-hidden />
        {t('nav.animales')}
      </NavLink>
      <NavLink to="/ajustes" className={link}>
        <Settings className="h-5 w-5" aria-hidden />
        {t('nav.ajustes')}
      </NavLink>
    </aside>
  );
}
