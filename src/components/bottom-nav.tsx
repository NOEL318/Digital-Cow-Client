/**
 * Barra de navegación inferior móvil rediseñada con Glassmorphism,
 * 5 destinos rápidos y botón central elevado con modal rápido de captura de campo.
 */
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home, Beef, Sprout, LayoutGrid, Plus,
  Syringe, Scale, Wheat, Truck, RotateCw, Handshake, DollarSign,
  Milk, Sparkles
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function BottomNav() {
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center text-[10px] gap-0.5 flex-1 py-1.5 transition-all ${
      isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-muted-foreground hover:text-foreground'
    }`;

  const QUICK_ACTIONS = [
    { to: '/hacer-nota/pese', icon: Scale, label: 'Pesar Ganado', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950' },
    { to: '/hacer-nota/vacune', icon: Syringe, label: 'Vacunar', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950' },
    { to: '/hacer-nota/ordene', icon: Milk, label: 'Ordeño', color: 'text-sky-600 bg-sky-50 dark:bg-sky-950' },
    { to: '/agricultura', icon: Sprout, label: 'Nueva Siembra', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950' },
    { to: '/agricultura', icon: Wheat, label: 'Cosechar', color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900' },
    { to: '/terrenos', icon: RotateCw, label: 'Rotar Potrero', color: 'text-lime-600 bg-lime-50 dark:bg-lime-950' },
    { to: '/maquinaria', icon: Truck, label: 'Servicio Mecánico', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950' },
    { to: '/comercio', icon: Handshake, label: 'Registrar Venta', color: 'text-emerald-800 bg-emerald-50 dark:bg-emerald-950' },
    { to: '/hacer-nota/gaste', icon: DollarSign, label: 'Gasto / Compra', color: 'text-red-600 bg-red-50 dark:bg-red-950' }
  ];

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-40 glass-nav md:hidden print:hidden"
        aria-label="Navegación móvil"
      >
        <div className="flex items-stretch justify-around px-1 py-1">
          <NavLink to="/inicio" className={linkClass} end>
            <Home className="h-5 w-5" aria-hidden />
            <span>Inicio</span>
          </NavLink>

          <NavLink to="/animales" className={linkClass}>
            <Beef className="h-5 w-5" aria-hidden />
            <span>Ganado</span>
          </NavLink>

          {/* Botón Central Elevado */}
          <button
            type="button"
            onClick={() => setQuickMenuOpen(true)}
            className="flex flex-col items-center justify-center text-[10px] gap-0.5 flex-1 -mt-5"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-600/40 ring-4 ring-background text-white">
              <Plus className="h-6 w-6" aria-hidden />
            </span>
            <span className="font-bold text-foreground mt-0.5">Captura</span>
          </button>

          <NavLink to="/agricultura" className={linkClass}>
            <Sprout className="h-5 w-5" aria-hidden />
            <span>Campo</span>
          </NavLink>

          <NavLink to="/panel" className={linkClass}>
            <LayoutGrid className="h-5 w-5" aria-hidden />
            <span>Menú</span>
          </NavLink>
        </div>
      </nav>

      {/* Modal Rápido de Captura Directa */}
      <Dialog open={quickMenuOpen} onOpenChange={setQuickMenuOpen}>
        <DialogContent className="max-w-sm glass-card border border-emerald-500/20 p-5">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Acción Rápida en Campo
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.to}
                  onClick={() => setQuickMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/60 hover:bg-accent transition-all text-center gap-1.5"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground leading-tight">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
