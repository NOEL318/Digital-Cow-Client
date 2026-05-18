import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, BellOff } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { BigButton } from '@/components/ui/big-button';
import { enablePush, pushPermission } from '@/lib/push-notifications';

/**
 * Página simple de selección de idioma, tema y notificaciones.
 */
export default function AjustesIdiomaTemaPage() {
  const { t } = useTranslation('common');
  const [perm, setPerm] = useState(pushPermission());
  useEffect(() => { setPerm(pushPermission()); }, []);

  async function activar() {
    const ok = await enablePush();
    setPerm(pushPermission());
    if (!ok && perm !== 'granted') {
      window.alert('No se activaron las notificaciones. Revisa los permisos del navegador.');
    }
  }

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-bold">{t('nav.ajustesIdiomaTema')}</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{t('language.label')}</h2>
        <LanguageSwitcher />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{t('themeToggle')}</h2>
        <ThemeToggle />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Notificaciones</h2>
        {perm === 'unsupported' ? (
          <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
            <BellOff className="h-4 w-4" aria-hidden />
            Tu navegador no soporta notificaciones.
          </p>
        ) : perm === 'granted' ? (
          <p className="text-sm text-green-700 inline-flex items-center gap-2">
            <Bell className="h-4 w-4" aria-hidden />
            Notificaciones activas.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Te avisamos cuando algo importante pase aunque no tengas la app abierta:
              vacuna atrasada, parto inminente, caída fuerte en producción.
            </p>
            <BigButton label="Activar notificaciones" icon={Bell} onClick={activar} />
          </div>
        )}
      </section>
    </div>
  );
}
