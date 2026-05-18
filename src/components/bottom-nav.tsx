import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Beef, PencilLine, Settings } from 'lucide-react';

/**
 * Barra inferior fija de cuatro destinos para movil.
 * El destino central "Hacer una nota" se renderiza como boton elevado
 * para destacarlo como el punto unico de captura y de panel; combina
 * lo que antes eran dos pantallas (Hacer y Panel).
 */
export function BottomNav() {
  const { t } = useTranslation('common');
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center text-xs gap-0.5 flex-1 py-2 ${
      isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
    }`;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-background border-t md:hidden print:hidden"
      aria-label={t('nav.hacerNota')}
    >
      <div className="flex items-stretch">
        <NavLink to="/inicio" className={linkClass} end>
          <Home className="h-5 w-5" aria-hidden />
          <span>{t('nav.inicio')}</span>
        </NavLink>
        <NavLink to="/animales" className={linkClass}>
          <Beef className="h-5 w-5" aria-hidden />
          <span>{t('nav.animales')}</span>
        </NavLink>
        <NavLink
          to="/hacer-nota"
          className="flex flex-col items-center justify-center text-xs gap-0.5 flex-1 py-2"
        >
          <span className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg ring-4 ring-background">
            <PencilLine className="h-7 w-7 text-primary-foreground" aria-hidden />
          </span>
          <span className="text-foreground font-semibold">{t('nav.hacerNota')}</span>
        </NavLink>
        <NavLink to="/ajustes" className={linkClass}>
          <Settings className="h-5 w-5" aria-hidden />
          <span>{t('nav.ajustes')}</span>
        </NavLink>
      </div>
    </nav>
  );
}
