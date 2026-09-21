/**
 * Shell autenticado rediseñado con Glassmorphism, barra superior con indicador de modo serverless,
 * sidebar fija de 64 (16rem) en escritorio y padding ajustado en móvil.
 */
import { Outlet, Link } from 'react-router-dom';
import { UserMenu } from './user-menu';
import { BottomNav } from './bottom-nav';
import { DesktopSidebar } from './desktop-sidebar';
import { OfflineIndicator } from './offline-indicator';
import { Calculator, Sparkles, Zap } from 'lucide-react';

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <header className="glass-header sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 print:hidden md:ml-64">
        <div className="flex items-center gap-2">
          {/* Logo en móvil */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-foreground">Digital Cow</span>
          </div>

          {/* Badge Serverless en escritorio */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
              <Zap className="h-3 w-3 text-emerald-500 fill-emerald-500" />
              100% Serverless • Vercel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/calculadoras"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
          >
            <Calculator className="h-3.5 w-3.5" />
            Calculadoras de Campo
          </Link>
          <UserMenu />
        </div>
      </header>

      <DesktopSidebar />

      <main className="flex-1 p-4 md:p-6 overflow-auto pb-28 md:pb-6 md:ml-64 print:p-0 print:ml-0">
        <Outlet />
      </main>

      <BottomNav />
      <OfflineIndicator />
    </div>
  );
}
