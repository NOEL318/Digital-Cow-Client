/**
 * Shell autenticado con Glassmorphism, temas de color dinámicos según la sección activa,
 * fondos ambientales para evitar confusión entre pantallas, alternador de Light/Dark mode
 * y navegación ergonómica.
 */
import { Outlet, Link, useLocation } from 'react-router-dom';
import { UserMenu } from './user-menu';
import { ThemeToggle } from './theme-toggle';
import { BottomNav } from './bottom-nav';
import { DesktopSidebar } from './desktop-sidebar';
import { OfflineIndicator } from './offline-indicator';
import {
  Calculator, Sparkles, Beef, Sprout, Fence, Truck,
  Handshake, HeartPulse, Baby, Settings, Home, FileText
} from 'lucide-react';

interface SectionConfig {
  name: string;
  badge: string;
  icon: typeof Sparkles;
  headerBg: string;
  headerBorder: string;
  badgeColor: string;
  mainGlow: string;
}

function getSectionConfig(pathname: string): SectionConfig {
  if (pathname.startsWith('/agricultura') || pathname.startsWith('/crops')) {
    return {
      name: 'Agricultura & Cosechas',
      badge: 'Agronomía',
      icon: Sprout,
      headerBg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      headerBorder: 'border-emerald-500/25 dark:border-emerald-800/40',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/40',
      mainGlow: 'bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent'
    };
  }

  if (pathname.startsWith('/terrenos') || pathname.startsWith('/ranches')) {
    return {
      name: 'Terrenos & Pasturas Voisin',
      badge: 'Territorial',
      icon: Fence,
      headerBg: 'bg-lime-500/10 dark:bg-lime-950/40',
      headerBorder: 'border-lime-500/25 dark:border-lime-800/40',
      badgeColor: 'bg-lime-100 text-lime-800 dark:bg-lime-950/70 dark:text-lime-300 border-lime-300/40',
      mainGlow: 'bg-gradient-to-b from-lime-500/10 via-lime-500/5 to-transparent'
    };
  }

  if (pathname.startsWith('/animales') || pathname.startsWith('/panel/produccion') || pathname.startsWith('/hacer-nota')) {
    return {
      name: 'Ganadería & Hato Bovino',
      badge: 'Zootecnia',
      icon: Beef,
      headerBg: 'bg-blue-500/10 dark:bg-blue-950/40',
      headerBorder: 'border-blue-500/25 dark:border-blue-800/40',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300/40',
      mainGlow: 'bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent'
    };
  }

  if (pathname.startsWith('/panel/salud')) {
    return {
      name: 'Salud Animal & Vacunas',
      badge: 'Sanidad',
      icon: HeartPulse,
      headerBg: 'bg-purple-500/10 dark:bg-purple-950/40',
      headerBorder: 'border-purple-500/25 dark:border-purple-800/40',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300/40',
      mainGlow: 'bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent'
    };
  }

  if (pathname.startsWith('/panel/reproduccion')) {
    return {
      name: 'Reproducción & Cría',
      badge: 'Genética',
      icon: Baby,
      headerBg: 'bg-pink-500/10 dark:bg-pink-950/40',
      headerBorder: 'border-pink-500/25 dark:border-pink-800/40',
      badgeColor: 'bg-pink-100 text-pink-800 dark:bg-pink-950/70 dark:text-pink-300 border-pink-300/40',
      mainGlow: 'bg-gradient-to-b from-pink-500/10 via-pink-500/5 to-transparent'
    };
  }

  if (pathname.startsWith('/maquinaria')) {
    return {
      name: 'Maquinaria & Taller',
      badge: 'Equipos',
      icon: Truck,
      headerBg: 'bg-amber-500/10 dark:bg-amber-950/40',
      headerBorder: 'border-amber-500/25 dark:border-amber-800/40',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300/40',
      mainGlow: 'bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent'
    };
  }

  if (pathname.startsWith('/calculadoras')) {
    return {
      name: 'Calculadoras de Campo',
      badge: 'Fórmulas',
      icon: Calculator,
      headerBg: 'bg-teal-500/10 dark:bg-teal-950/40',
      headerBorder: 'border-teal-500/25 dark:border-teal-800/40',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-300/40',
      mainGlow: 'bg-gradient-to-b from-teal-500/10 via-teal-500/5 to-transparent'
    };
  }

  if (pathname.startsWith('/comercio') || pathname.startsWith('/finanzas') || pathname.startsWith('/panel/dinero') || pathname.startsWith('/panel/reportes')) {
    const isReports = pathname.startsWith('/panel/reportes');
    return {
      name: isReports ? 'Reportes & Analítica' : 'Comercio & Finanzas',
      badge: isReports ? 'Informes' : 'Comercial',
      icon: isReports ? FileText : Handshake,
      headerBg: isReports ? 'bg-indigo-500/10 dark:bg-indigo-950/40' : 'bg-violet-500/10 dark:bg-violet-950/40',
      headerBorder: isReports ? 'border-indigo-500/25 dark:border-indigo-800/40' : 'border-violet-500/25 dark:border-violet-800/40',
      badgeColor: isReports ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-300/40' : 'bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-300 border-violet-300/40',
      mainGlow: isReports ? 'bg-gradient-to-b from-indigo-500/10 via-indigo-500/5 to-transparent' : 'bg-gradient-to-b from-violet-500/10 via-violet-500/5 to-transparent'
    };
  }

  if (pathname.startsWith('/ajustes')) {
    return {
      name: 'Ajustes del Sistema',
      badge: 'Configuración',
      icon: Settings,
      headerBg: 'bg-slate-500/10 dark:bg-slate-900/50',
      headerBorder: 'border-slate-500/25 dark:border-slate-800/40',
      badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300/40',
      mainGlow: 'bg-gradient-to-b from-slate-500/5 via-transparent to-transparent'
    };
  }

  // Por defecto: Inicio / Dashboard
  return {
    name: 'Panel General',
    badge: 'Operación',
    icon: Home,
    headerBg: 'bg-slate-900/5 dark:bg-slate-900/60',
    headerBorder: 'border-slate-200/60 dark:border-slate-800/80',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/40',
    mainGlow: 'bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent'
  };
}

export function AppShell() {
  const location = useLocation();
  const section = getSectionConfig(location.pathname);
  const SectionIcon = section.icon;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 transition-colors">
      {/* Header con colores dinámicos según la sección activa */}
      <header
        className={`backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 print:hidden md:ml-64 border-b transition-colors ${section.headerBg} ${section.headerBorder}`}
      >
        <div className="flex items-center gap-3">
          {/* Logo en móvil */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-foreground">Digital Cow</span>
          </div>

          {/* Identificador de Sección Activa (Escritorio) */}
          <div className="hidden md:flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-background/60 shadow-sm text-foreground">
              <SectionIcon className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">{section.name}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${section.badgeColor}`}>
              {section.badge}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón directo a Calculadoras si no está en la página */}
          {!location.pathname.startsWith('/calculadoras') && (
            <Link
              to="/calculadoras"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
            >
              <Calculator className="h-3.5 w-3.5" />
              Calculadoras
            </Link>
          )}

          {/* Toggle Light / Dark mode */}
          <ThemeToggle />

          {/* Menú de Usuario */}
          <UserMenu />
        </div>
      </header>

      <DesktopSidebar />

      {/* Main con fondo ambiental sutil correspondiente al color de la sección */}
      <main className={`flex-1 p-4 md:p-6 overflow-auto pb-28 md:pb-6 md:ml-64 print:p-0 print:ml-0 ${section.mainGlow} transition-colors`}>
        <Outlet />
      </main>

      <BottomNav />
      <OfflineIndicator />
    </div>
  );
}
