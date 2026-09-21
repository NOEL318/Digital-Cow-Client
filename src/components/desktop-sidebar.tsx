/**
 * Barra lateral de navegación de escritorio rediseñada con Glassmorphism,
 * iconos en todas partes, colores temáticos por sección y acceso rápido.
 */
import { NavLink } from 'react-router-dom';
import {
  Home, Beef, Scale, HeartPulse, Baby, Wheat,
  Sprout, Fence, Truck, Handshake, Calculator, Settings,
  Sparkles
} from 'lucide-react';

export function DesktopSidebar() {
  const linkClass = (activeColor: string) => ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
      isActive
        ? `${activeColor} shadow-sm backdrop-blur-sm`
        : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-foreground'
    }`;

  return (
    <aside
      className="hidden md:flex md:flex-col fixed inset-y-0 left-0 w-64 glass-sidebar p-3 z-30 print:hidden overflow-y-auto"
      aria-label="Navegación principal"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-3 py-3 mb-2 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-foreground block leading-tight">Digital Cow</span>
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Agro & Ganadería</span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="space-y-4 flex-1">
        {/* Principal */}
        <div className="space-y-1">
          <NavLink
            to="/inicio"
            className={linkClass('bg-slate-900 text-white dark:bg-white dark:text-slate-900')}
            end
          >
            <Home className="h-4 w-4" />
            <span className="text-sm">Inicio</span>
          </NavLink>
        </div>

        {/* Ganadería (Azul) */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <Beef className="h-3 w-3" />
            <span>Ganadería</span>
          </div>
          <NavLink
            to="/animales"
            className={linkClass('bg-blue-600 text-white shadow-blue-500/20')}
          >
            <Beef className="h-4 w-4 text-blue-500 group-[.bg-blue-600]:text-white" />
            <span>Hato & Animales</span>
          </NavLink>
          <NavLink
            to="/panel/produccion"
            className={linkClass('bg-blue-600 text-white shadow-blue-500/20')}
          >
            <Scale className="h-4 w-4 text-blue-500 group-[.bg-blue-600]:text-white" />
            <span>Producción & Pesaje</span>
          </NavLink>
          <NavLink
            to="/panel/salud"
            className={linkClass('bg-purple-600 text-white shadow-purple-500/20')}
          >
            <HeartPulse className="h-4 w-4 text-purple-500 group-[.bg-purple-600]:text-white" />
            <span>Salud & Vacunas</span>
          </NavLink>
          <NavLink
            to="/panel/reproduccion"
            className={linkClass('bg-pink-600 text-white shadow-pink-500/20')}
          >
            <Baby className="h-4 w-4 text-pink-500 group-[.bg-pink-600]:text-white" />
            <span>Reproducción</span>
          </NavLink>
          <NavLink
            to="/panel/alimentacion"
            className={linkClass('bg-amber-600 text-white shadow-amber-500/20')}
          >
            <Wheat className="h-4 w-4 text-amber-500 group-[.bg-amber-600]:text-white" />
            <span>Alimentación</span>
          </NavLink>
        </div>

        {/* Agricultura & Terrenos (Verde / Lima) */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Sprout className="h-3 w-3" />
            <span>Campo & Suelo</span>
          </div>
          <NavLink
            to="/agricultura"
            className={linkClass('bg-emerald-600 text-white shadow-emerald-500/20')}
          >
            <Sprout className="h-4 w-4 text-emerald-500 group-[.bg-emerald-600]:text-white" />
            <span>Siembras & Cosechas</span>
          </NavLink>
          <NavLink
            to="/terrenos"
            className={linkClass('bg-lime-600 text-white shadow-lime-500/20')}
          >
            <Fence className="h-4 w-4 text-lime-500 group-[.bg-lime-600]:text-white" />
            <span>Potreros & Corrales</span>
          </NavLink>
        </div>

        {/* Maquinaria & Comercio (Naranja / Dólar) */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Truck className="h-3 w-3" />
            <span>Operaciones & Flota</span>
          </div>
          <NavLink
            to="/maquinaria"
            className={linkClass('bg-amber-600 text-white shadow-amber-500/20')}
          >
            <Truck className="h-4 w-4 text-amber-500 group-[.bg-amber-600]:text-white" />
            <span>Maquinaria & Taller</span>
          </NavLink>
          <NavLink
            to="/comercio"
            className={linkClass('bg-emerald-700 text-white shadow-emerald-600/20')}
          >
            <Handshake className="h-4 w-4 text-emerald-600 group-[.bg-emerald-700]:text-white" />
            <span>Ventas, Compras & Insumos</span>
          </NavLink>
          <NavLink
            to="/calculadoras"
            className={linkClass('bg-teal-600 text-white shadow-teal-500/20')}
          >
            <Calculator className="h-4 w-4 text-teal-500 group-[.bg-teal-600]:text-white" />
            <span>Calculadoras de Campo</span>
          </NavLink>
        </div>

        {/* Ajustes */}
        <div className="space-y-1 pt-2 border-t border-border/50">
          <NavLink
            to="/ajustes"
            className={linkClass('bg-slate-700 text-white dark:bg-slate-800')}
          >
            <Settings className="h-4 w-4 text-slate-500 group-[.bg-slate-700]:text-white" />
            <span>Ajustes & Configuración</span>
          </NavLink>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-border/50 px-2 text-[11px] text-muted-foreground flex items-center justify-between">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Serverless Activo
        </span>
        <span className="font-mono text-[10px] opacity-70">v2.0</span>
      </div>
    </aside>
  );
}
