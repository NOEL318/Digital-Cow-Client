/**
 * Esta pagina es el indice del menu de ajustes con accesos a perfil, cuenta, ranchos, equipo, medicamentos e idioma.
 */
import { useEffect, useState } from 'react';
import {
  User, Building2, Map, Users, Tags, Pill, Palette, Bell, BellOff,
  type LucideIcon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProfileSettingsPage from '@/pages/settings/ProfileSettingsPage';
import AccountSettingsPage from '@/pages/settings/AccountSettingsPage';
import RanchesPage from '@/pages/ranches/RanchesPage';
import TeamPage from '@/pages/team/TeamPage';
import CategoriesPage from '@/pages/finance/CategoriesPage';
import AjustesMedicamentosPage from './AjustesMedicamentosPage';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { BigButton } from '@/components/ui/big-button';
import { enablePush, pushPermission } from '@/lib/push-notifications';

interface Group {
  id: string;
  title: string;
  icon: LucideIcon;
  blocks: Array<{ id: string; title: string; icon: LucideIcon; render: () => JSX.Element }>;
}

/**
 * Pagina unica de Ajustes. Reune en una sola vista todas las
 * sub-paginas de configuracion organizadas por categorias. Una
 * barra superior pegajosa permite saltar rapido a cualquier seccion
 * sin perderse en menus anidados.
 */
export default function AjustesIndexPage() {
  const { t } = useTranslation('common');

  const groups: Group[] = [
    {
      id: 'cuenta',
      title: t('ajustes.groupAccount'),
      icon: User,
      blocks: [
        { id: 'perfil',  title: t('nav.ajustesPerfil'),  icon: User,        render: () => <ProfileSettingsPage /> },
        { id: 'cuenta-config', title: t('nav.ajustesCuenta'), icon: Building2, render: () => <AccountSettingsPage /> }
      ]
    },
    {
      id: 'rancho',
      title: t('ajustes.groupRanch'),
      icon: Map,
      blocks: [
        { id: 'ranchos', title: t('nav.ajustesRanchos'), icon: Map,   render: () => <RanchesPage /> },
        { id: 'equipo',  title: t('nav.ajustesEquipo'),  icon: Users, render: () => <TeamPage /> }
      ]
    },
    {
      id: 'catalogos',
      title: t('ajustes.groupCatalogs'),
      icon: Tags,
      blocks: [
        { id: 'medicamentos', title: t('nav.ajustesMedicamentos'), icon: Pill, render: () => <AjustesMedicamentosPage /> },
        { id: 'categorias',   title: t('nav.ajustesCategorias'),   icon: Tags, render: () => <CategoriesPage /> }
      ]
    },
    {
      id: 'preferencias',
      title: t('ajustes.groupPreferences'),
      icon: Palette,
      blocks: [
        { id: 'idioma-tema', title: t('nav.ajustesIdiomaTema'), icon: Palette, render: () => <PreferenciasBlock /> }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t('nav.ajustes')}</h1>
        <p className="text-muted-foreground">{t('ajustes.subtitle')}</p>
      </header>

      {/* Chips de navegacion rapida a categorias */}
      <nav
        aria-label={t('ajustes.categoriesAria')}
        className="sticky top-0 z-20 -mx-4 px-4 py-2 bg-background border-b flex gap-2 overflow-x-auto print:hidden"
      >
        {groups.map(g => {
          const Icon = g.icon;
          return (
            <a
              key={g.id}
              href={`#grupo-${g.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm whitespace-nowrap hover:bg-accent"
            >
              <Icon className="h-4 w-4" aria-hidden />
              {g.title}
            </a>
          );
        })}
      </nav>

      {groups.map(g => {
        const GroupIcon = g.icon;
        return (
          <section key={g.id} id={`grupo-${g.id}`} className="space-y-3 scroll-mt-20">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-1">
              <GroupIcon className="h-5 w-5 text-primary" aria-hidden />
              {g.title}
            </h2>
            <div className="space-y-4">
              {g.blocks.map(b => {
                const BlockIcon = b.icon;
                return (
                  <article
                    key={b.id}
                    id={`bloque-${b.id}`}
                    className="rounded-xl border bg-background p-4 space-y-3"
                  >
                    <h3 className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
                      <BlockIcon className="h-4 w-4" aria-hidden />
                      {b.title}
                    </h3>
                    <div>{b.render()}</div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/**
 * Bloque combinado de preferencias: idioma, tema y notificaciones
 * push. Antes era una pagina aparte; ahora vive embebida.
 */
function PreferenciasBlock() {
  const { t } = useTranslation('common');
  const [perm, setPerm] = useState(pushPermission());
  useEffect(() => { setPerm(pushPermission()); }, []);

  async function activar() {
    const ok = await enablePush();
    setPerm(pushPermission());
    if (!ok && perm !== 'granted') {
      window.alert(t('notifications.enableFailed'));
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">{t('language.label')}</p>
          <LanguageSwitcher />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">{t('themeToggle')}</p>
          <ThemeToggle />
        </div>
      </div>

      <div className="border-t pt-3 space-y-2">
        <p className="text-sm font-medium">{t('notifications.title')}</p>
        {perm === 'unsupported' ? (
          <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
            <BellOff className="h-4 w-4" aria-hidden />
            {t('notifications.unsupported')}
          </p>
        ) : perm === 'granted' ? (
          <p className="text-sm text-success inline-flex items-center gap-2">
            <Bell className="h-4 w-4" aria-hidden />
            {t('notifications.active')}
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('notifications.pitch')}
            </p>
            <BigButton label={t('notifications.enable')} icon={Bell} onClick={activar} />
          </div>
        )}
      </div>
    </div>
  );
}
