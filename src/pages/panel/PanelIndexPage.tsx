/**
 * Centro de Comando y Paneles Operativos del Rancho.
 * Rediseñado con Glassmorphism, tarjetas temáticas coloreadas y acceso completo a todos los módulos.
 */
import { Link } from 'react-router-dom';
import {
  Activity, Wheat, DollarSign, Heart, Scale, FileText,
  Sprout, Fence, Truck, Handshake, Calculator, Beef,
  LayoutGrid
} from 'lucide-react';

const OPERATIONAL_PANELS = [
  // Campo & Suelo (Verde / Lima)
  {
    to: '/agricultura',
    icon: Sprout,
    title: 'Agricultura & Siembras',
    subtitle: 'Control de cultivos, ciclos, insumos y toneladas cosechadas',
    category: 'Campo & Suelo',
    color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    to: '/terrenos',
    icon: Fence,
    title: 'Terrenos & Pastoreo Voisin',
    subtitle: 'Rotación de potreros en 1 clic, aforos, parcelas y corrales',
    category: 'Campo & Suelo',
    color: 'text-lime-700 dark:text-lime-300 bg-lime-500/10 border-lime-500/20'
  },

  // Flota & Operaciones (Ámbar / Naranja)
  {
    to: '/maquinaria',
    icon: Truck,
    title: 'Maquinaria & Equipos',
    subtitle: 'Tractores, horómetros, alertas mecánicas y consumo de diesel',
    category: 'Operaciones',
    color: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20'
  },
  {
    to: '/comercio',
    icon: Handshake,
    title: 'Comercio & Ventas',
    subtitle: 'Ventas de ganado por kg, venta de cosechas e insumos de bodega',
    category: 'Comercio',
    color: 'text-emerald-800 dark:text-emerald-300 bg-emerald-600/10 border-emerald-600/20'
  },
  {
    to: '/calculadoras',
    icon: Calculator,
    title: 'Calculadoras de Campo',
    subtitle: 'GMD de carne, carga UGM, densidad de siembra y márgenes t/ha',
    category: 'Zootecnia',
    color: 'text-teal-700 dark:text-teal-300 bg-teal-500/10 border-teal-500/20'
  },

  // Ganadería & Salud (Azul / Púrpura / Rosa)
  {
    to: '/animales',
    icon: Beef,
    title: 'Hato Ganadero',
    subtitle: 'Inventario bovino, aretes, pedigrí y tarjetas individuales',
    category: 'Ganadería',
    color: 'text-blue-700 dark:text-blue-300 bg-blue-500/10 border-blue-500/20'
  },
  {
    to: '/panel/produccion',
    icon: Scale,
    title: 'Producción & Pesajes',
    subtitle: 'Curvas de leche, pesajes en báscula y rendimiento de canal',
    category: 'Ganadería',
    color: 'text-blue-700 dark:text-blue-300 bg-blue-500/10 border-blue-500/20'
  },
  {
    to: '/panel/salud',
    icon: Activity,
    title: 'Salud & Vacunación',
    subtitle: 'Vacunas, diagnósticos, tratamientos y visitas veterinarias',
    category: 'Salud',
    color: 'text-purple-700 dark:text-purple-300 bg-purple-500/10 border-purple-500/20'
  },
  {
    to: '/panel/reproduccion',
    icon: Heart,
    title: 'Reproducción & Cría',
    subtitle: 'Celos, inseminaciones, chequeos de preñez y partos',
    category: 'Salud',
    color: 'text-pink-700 dark:text-pink-300 bg-pink-500/10 border-pink-500/20'
  },
  {
    to: '/panel/alimentacion',
    icon: Wheat,
    title: 'Alimentación & Forrajes',
    subtitle: 'Raciones, concentrados, comederos y costos por cabeza',
    category: 'Nutrición',
    color: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20'
  },
  {
    to: '/panel/dinero',
    icon: DollarSign,
    title: 'Finanzas & Caja',
    subtitle: 'Ingresos, gastos operativos, categorías y balance de caja',
    category: 'Finanzas',
    color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    to: '/panel/reportes',
    icon: FileText,
    title: 'Reportes & PnL',
    subtitle: 'Estados de pérdidas y ganancias, inventarios y cierres',
    category: 'Finanzas',
    color: 'text-slate-700 dark:text-slate-300 bg-slate-500/10 border-slate-500/20'
  }
];

export default function PanelIndexPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="glass-panel p-6 border-slate-300/40 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-md">
            <LayoutGrid className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              Centro de Módulos Operativos
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Todos los paneles especializados de ganadería, agricultura, maquinaria y administración rural.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OPERATIONAL_PANELS.map(panel => {
          const Icon = panel.icon;
          return (
            <Link
              key={panel.to}
              to={panel.to}
              className={`glass-card p-5 border flex items-start gap-4 hover:scale-[1.02] transition-all ${panel.color}`}
            >
              <div className="p-3 rounded-2xl bg-background/80 shadow-sm shrink-0">
                <Icon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mb-0.5">
                  {panel.category}
                </span>
                <h3 className="text-base font-bold text-foreground leading-snug">
                  {panel.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {panel.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
