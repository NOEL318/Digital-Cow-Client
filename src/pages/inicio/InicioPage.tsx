/**
 * Inicio / Dashboard Principal Agropecuario.
 * Rediseñado con Glassmorphism, métricas rápidas de ganadería, agricultura, maquinaria y comercio,
 * accesos directos por colores temáticos de sección, sin texto de relleno e íconos en todas partes.
 */
import { Link } from 'react-router-dom';
import {
  Sun, AlertTriangle, Sparkles, Sprout, Wheat, Truck, RotateCw,
  Handshake, Calculator, Scale, Beef, Milk, Syringe, Pill, Baby,
  FileBarChart, DollarSign, Layers, Plus, ArrowUpRight, ArrowDownRight,
  ShieldAlert, CheckCircle2, type LucideIcon
} from 'lucide-react';
import { useAgendaToday, usePredictiveAlerts } from '@/features/agenda/api';
import { useAgronomyKpis } from '@/features/crops/api';
import { useLands } from '@/features/lands/api';
import { useMachineryList } from '@/features/machinery/api';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

const SEVERITY_BG: Record<string, string> = {
  high: 'border-red-300 dark:border-red-800 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-200',
  medium: 'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200',
  low: 'border-border bg-card/60'
};

const TASK_ICON: Record<string, { icon: LucideIcon; color: string }> = {
  VACCINATION: { icon: Syringe, color: 'text-purple-600 dark:text-purple-400' },
  CALVING: { icon: Baby, color: 'text-pink-600 dark:text-pink-400' },
  WEIGHING_OVERDUE: { icon: Scale, color: 'text-amber-600 dark:text-amber-400' },
  TREATMENT_OPEN: { icon: Pill, color: 'text-red-600 dark:text-red-400' },
  LONG_OPEN_DAYS: { icon: Baby, color: 'text-purple-600 dark:text-purple-400' },
  MILK_DROP: { icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' }
};

export default function InicioPage() {
  const agenda = useAgendaToday();
  const alerts = usePredictiveAlerts();
  const { data: agroKpis } = useAgronomyKpis();
  const { data: lands = [] } = useLands();
  const { data: machinery = [] } = useMachineryList();

  const allTasks: Array<{
    key: string;
    icon: LucideIcon;
    color: string;
    label: string;
    message: string;
    detail: string;
    severity: string;
    to: string;
  }> = [];

  for (const item of agenda.data ?? []) {
    const meta = TASK_ICON[item.type] ?? { icon: Sparkles, color: 'text-muted-foreground' };
    allTasks.push({
      key: `agenda-${item.type}-${item.animalId}-${item.dueDate}`,
      icon: meta.icon,
      color: meta.color,
      label: item.type,
      message: item.message,
      detail: item.animalTag ? `Arete: ${item.animalTag}` : (item.lotName ?? ''),
      severity: item.severity,
      to: item.animalId ? `/animales/${item.animalId}` : '/animales'
    });
  }

  for (const a of alerts.data ?? []) {
    const meta = TASK_ICON[a.type] ?? { icon: Sparkles, color: 'text-muted-foreground' };
    allTasks.push({
      key: `alert-${a.type}-${a.animalId}`,
      icon: meta.icon,
      color: meta.color,
      label: a.type,
      message: a.detail,
      detail: `Arete: ${a.animalTag}`,
      severity: a.severity,
      to: `/animales/${a.animalId}`
    });
  }

  // Alerta si hay maquinaria con mantenimiento próximo (<50 hrs)
  const machinesNearService = machinery.filter(m => m.nextServiceHours > 0 && m.currentHoursMeter >= m.nextServiceHours - 50);
  for (const m of machinesNearService) {
    allTasks.push({
      key: `machinery-${m.id}`,
      icon: ShieldAlert,
      color: 'text-amber-600 dark:text-amber-400',
      label: 'MANTENIMIENTO PRÓXIMO',
      message: `${m.name} requiere servicio preventivo`,
      detail: `Horómetro: ${m.currentHoursMeter} hrs / Próx: ${m.nextServiceHours} hrs`,
      severity: 'medium',
      to: '/maquinaria'
    });
  }

  const pasturesResting = lands.filter(l => l.type === 'PASTURE' && l.status === 'RESTING').length;
  const pasturesActive = lands.filter(l => l.type === 'PASTURE' && l.status === 'ACTIVE').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header con Glassmorphism */}
      <div className="glass-panel p-6 border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Sun className="h-7 w-7 text-amber-500 animate-spin-slow" />
              Rancho El Paraíso
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300/40">
              Operación Integral
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Gestión completa de hato ganadero, siembras, pasturas rotacionales, maquinaria y ventas.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 gap-1.5 text-xs font-semibold">
            <Link to="/calculadoras">
              <Calculator className="h-4 w-4" />
              Calculadoras
            </Link>
          </Button>
          <Button asChild variant="outline" className="text-xs font-semibold gap-1.5 border-border hover:bg-accent">
            <Link to="/comercio">
              <Handshake className="h-4 w-4" />
              Comercio
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Consolidados (Multidominio Agropecuario) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Ganadería */}
        <Link to="/animales" className="glass-card p-4 border-l-4 border-l-blue-600 hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Ganadería</span>
            <Beef className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-foreground">36 <span className="text-xs font-normal text-muted-foreground">cabezas</span></div>
            <p className="text-xs text-muted-foreground mt-0.5">Leche, engorda y pie de cría</p>
          </div>
        </Link>

        {/* Agricultura */}
        <Link to="/agricultura" className="glass-card p-4 border-l-4 border-l-emerald-600 hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Agricultura</span>
            <Sprout className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-foreground">{agroKpis?.activeCropsHectares ?? 20.5} <span className="text-xs font-normal text-muted-foreground">ha en cultivo</span></div>
            <p className="text-xs text-muted-foreground mt-0.5">Maíz ensilaje y alfalfa de corte</p>
          </div>
        </Link>

        {/* Terrenos / Potreros */}
        <Link to="/terrenos" className="glass-card p-4 border-l-4 border-l-lime-600 hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400">Pastoreo Voisin</span>
            <RotateCw className="h-5 w-5 text-lime-600 dark:text-lime-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-foreground">{pasturesActive} <span className="text-xs font-normal text-muted-foreground">pastoreo</span> / {pasturesResting} <span className="text-xs font-normal text-muted-foreground">descanso</span></div>
            <p className="text-xs text-muted-foreground mt-0.5">Rotación de potreros activa</p>
          </div>
        </Link>

        {/* Maquinaria */}
        <Link to="/maquinaria" className="glass-card p-4 border-l-4 border-l-amber-600 hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Maquinaria</span>
            <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-foreground">{machinery.filter(m => m.status === 'OPERATIONAL').length} / {machinery.length} <span className="text-xs font-normal text-muted-foreground">operativos</span></div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {machinesNearService.length > 0 ? (
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {machinesNearService.length} servicio próximo
                </span>
              ) : 'Flota al 100%'}
            </p>
          </div>
        </Link>
      </div>

      {/* Alertas & Agenda del Día */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Pendientes & Alertas Operativas ({allTasks.length})
          </h2>
          {allTasks.length > 0 && (
            <span className="text-xs text-muted-foreground">Revisión prioritaria de hoy</span>
          )}
        </div>

        {allTasks.length === 0 ? (
          <div className="glass-card p-6">
            <EmptyState
              icon={CheckCircle2}
              title="Todo al día en el rancho"
              description="No hay tareas urgentes de vacunación, pesaje o maquinaria pendientes hoy."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allTasks.map(task => {
              const Icon = task.icon;
              return (
                <Link
                  key={task.key}
                  to={task.to}
                  className={`glass-card p-4 border flex items-start gap-3 transition-all hover:scale-[1.01] ${SEVERITY_BG[task.severity] ?? 'border-border'}`}
                >
                  <div className="p-2 rounded-xl bg-background/80 shrink-0 shadow-sm">
                    <Icon className={`h-5 w-5 ${task.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">{task.label}</span>
                    <p className="text-sm font-bold text-foreground leading-snug">{task.message}</p>
                    {task.detail && <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.detail}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Acciones Rápidas de Campo (Organizadas por Colores de Sección, sin texto superfluo) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          Acciones Rápidas en Terreno
        </h2>

        {/* Fila 1: Ganadería (Azul) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            <Beef className="h-3.5 w-3.5" />
            <span>Ganadería & Producción</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
            <QuickTile to="/hacer-nota/pese" icon={Scale} label="Pesar Animal" tag="+ kg" color="text-blue-600 bg-blue-500/10 border-blue-200 dark:border-blue-800" />
            <QuickTile to="/hacer-nota/ordene" icon={Milk} label="Ordeño" tag="+ Litros" color="text-blue-600 bg-blue-500/10 border-blue-200 dark:border-blue-800" />
            <QuickTile to="/hacer-nota/vacune" icon={Syringe} label="Vacunar" tag="Sanidad" color="text-purple-600 bg-purple-500/10 border-purple-200 dark:border-purple-800" />
            <QuickTile to="/hacer-nota/trate" icon={Pill} label="Tratamiento" tag="Medicamento" color="text-purple-600 bg-purple-500/10 border-purple-200 dark:border-purple-800" />
            <QuickTile to="/animales/nuevo" icon={Plus} label="Comprar Ganado" tag="+ Hato" color="text-blue-600 bg-blue-500/10 border-blue-200 dark:border-blue-800" />
          </div>
        </div>

        {/* Fila 2: Agricultura & Terrenos (Verde Esmeralda & Lima) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            <Sprout className="h-3.5 w-3.5" />
            <span>Agricultura & Manejo Territorial</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
            <QuickTile to="/agricultura" icon={Sprout} label="Nueva Siembra" tag="Cultivo" color="text-emerald-700 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800" />
            <QuickTile to="/agricultura" icon={Wheat} label="Cosechar" tag="+ Toneladas" color="text-emerald-700 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800" />
            <QuickTile to="/terrenos" icon={RotateCw} label="Rotar Potrero" tag="Voisin" color="text-lime-700 bg-lime-500/10 border-lime-200 dark:border-lime-800" />
            <QuickTile to="/terrenos" icon={Layers} label="Gestionar Terrenos" tag="Parcelas" color="text-lime-700 bg-lime-500/10 border-lime-200 dark:border-lime-800" />
            <QuickTile to="/calculadoras" icon={Calculator} label="Calculadoras de Campo" tag="GMD / UGM" color="text-teal-700 bg-teal-500/10 border-teal-200 dark:border-teal-800" />
          </div>
        </div>

        {/* Fila 3: Maquinaria & Comercio (Ámbar & Oro) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            <Truck className="h-3.5 w-3.5" />
            <span>Maquinaria, Ventas & Finanzas</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
            <QuickTile to="/maquinaria" icon={Truck} label="Servicio Mecánico" tag="Taller" color="text-amber-700 bg-amber-500/10 border-amber-200 dark:border-amber-800" />
            <QuickTile to="/maquinaria" icon={Truck} label="Cargar Diesel" tag="Horómetro" color="text-amber-700 bg-amber-500/10 border-amber-200 dark:border-amber-800" />
            <QuickTile to="/comercio" icon={ArrowUpRight} label="Venta de Ganado" tag="Báscula" color="text-emerald-700 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800" />
            <QuickTile to="/comercio" icon={ArrowDownRight} label="Compra de Insumos" tag="Bodega" color="text-amber-700 bg-amber-500/10 border-amber-200 dark:border-amber-800" />
            <QuickTile to="/panel/dinero" icon={DollarSign} label="Flujo de Caja" tag="PnL" color="text-emerald-700 bg-emerald-500/10 border-emerald-200 dark:border-emerald-800" />
          </div>
        </div>
      </section>

      {/* Hub de Paneles Especializados */}
      <section className="space-y-3 pt-2">
        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
          <FileBarChart className="h-5 w-5 text-primary" />
          Módulos Operativos del Rancho
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <ModuleCard to="/animales" icon={Beef} title="Hato Ganadero" subtitle="Inventario bovino y tarjetas individuales" color="text-blue-600 bg-blue-500/10" />
          <ModuleCard to="/agricultura" icon={Sprout} title="Agricultura" subtitle="Siembras, ciclos y cosechas por lote" color="text-emerald-600 bg-emerald-500/10" />
          <ModuleCard to="/terrenos" icon={RotateCw} title="Terrenos & Pasturas" subtitle="Rotación Voisin, aforos y corrales" color="text-lime-600 bg-lime-500/10" />
          <ModuleCard to="/maquinaria" icon={Truck} title="Maquinaria & Taller" subtitle="Tractores, horómetros y combustibles" color="text-amber-600 bg-amber-500/10" />
          <ModuleCard to="/comercio" icon={Handshake} title="Comercio & Ventas" subtitle="Venta en pie, cosechas y bodega" color="text-emerald-700 bg-emerald-500/10" />
          <ModuleCard to="/calculadoras" icon={Calculator} title="Calculadoras de Campo" subtitle="GMD, carga UGM, siembra y ROI" color="text-teal-600 bg-teal-500/10" />
          <ModuleCard to="/panel/salud" icon={Syringe} title="Salud Animal" subtitle="Planes sanitarios, vacunas y diagnósticos" color="text-purple-600 bg-purple-500/10" />
          <ModuleCard to="/panel/reportes" icon={FileBarChart} title="Reportes & PnL" subtitle="Estados financieros e inventarios" color="text-slate-700 bg-slate-500/10" />
        </div>
      </section>
    </div>
  );
}

function QuickTile({ to, icon: Icon, label, tag, color }: { to: string; icon: LucideIcon; label: string; tag: string; color: string }) {
  return (
    <Link
      to={to}
      className={`glass-card p-3.5 flex flex-col justify-between border hover:scale-[1.02] transition-all min-h-[90px] ${color}`}
    >
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5" />
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-background/80 shadow-xs">{tag}</span>
      </div>
      <span className="text-xs font-bold text-foreground leading-tight mt-2">{label}</span>
    </Link>
  );
}

function ModuleCard({ to, icon: Icon, title, subtitle, color }: { to: string; icon: LucideIcon; title: string; subtitle: string; color: string }) {
  return (
    <Link
      to={to}
      className="glass-card p-4 flex items-start gap-3 hover:border-primary/40 hover:scale-[1.01] transition-all"
    >
      <div className={`p-2.5 rounded-xl shrink-0 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-foreground leading-snug">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{subtitle}</p>
      </div>
    </Link>
  );
}

