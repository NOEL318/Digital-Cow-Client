import { Link } from 'react-router-dom';
import {
  Syringe, Baby, Scale, Pill, AlertTriangle, Sparkles, Sun, Stethoscope,
  Milk, MilkOff, Wheat, ShoppingCart, Handshake, MinusCircle, PlusCircle, Heart,
  HeartPulse, DollarSign, Beef, FileBarChart, Egg, Droplet, GraduationCap, HeartCrack,
  type LucideIcon
} from 'lucide-react';
import { useAgendaToday, usePredictiveAlerts } from '@/features/agenda/api';
import { EmptyState } from '@/components/ui/empty-state';

const TASK_META: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  VACCINATION:      { icon: Syringe,        color: 'text-sky-700',    label: 'Vacuna' },
  CALVING:          { icon: Baby,           color: 'text-pink-700',   label: 'Parto' },
  WEIGHING_OVERDUE: { icon: Scale,          color: 'text-amber-700',  label: 'Pesar' },
  TREATMENT_OPEN:   { icon: Pill,           color: 'text-red-700',    label: 'Tratamiento' },
  LONG_OPEN_DAYS:   { icon: Baby,           color: 'text-purple-700', label: 'Sin servicio' },
  MILK_DROP:        { icon: AlertTriangle,  color: 'text-red-700',    label: 'Bajó producción' }
};

const SEVERITY_BG: Record<string, string> = {
  high:   'border-red-300 bg-red-50 dark:bg-red-950/30',
  medium: 'border-amber-300 bg-amber-50 dark:bg-amber-950/30',
  low:    'border-input'
};

interface Tile { to: string; icon: LucideIcon; label: string; description: string }

// Orden por frecuencia tipica de uso en rancho mexicano: lo que se
// hace todos los dias (alimento, ordeno, gasto) primero; lo
// ocasional (compra, venta, prenez) al final.
const ACCIONES: Tile[] = [
  // Diario / muy frecuente
  { to: '/hacer-nota/alimentar', icon: Wheat, label: 'Alimenté', description: 'Lo que comieron hoy.' },
  { to: '/hacer-nota/ordene', icon: Milk, label: 'Ordeñé', description: 'Registrar el ordeño de una vaca.' },
  { to: '/hacer-nota/gaste', icon: MinusCircle, label: 'Gasté', description: 'Anotar dinero que salió.' },
  { to: '/hacer-nota/recibi', icon: PlusCircle, label: 'Recibí dinero', description: 'Anotar dinero que entró.' },
  // Semanal / quincenal
  { to: '/hacer-nota/pese', icon: Scale, label: 'Pesé', description: 'Anotar el peso de un animal.' },
  { to: '/hacer-nota/celo', icon: Heart, label: 'Vi un celo', description: 'Detección de celo.' },
  { to: '/hacer-nota/servi', icon: Droplet, label: 'Inseminé / serví', description: 'Inseminación o monta.' },
  { to: '/hacer-nota/vacune', icon: Syringe, label: 'Vacuné', description: 'Registrar una vacuna aplicada.' },
  // Cuando enferma o necesita
  { to: '/hacer-nota/diagnostique', icon: Stethoscope, label: 'Diagnostiqué', description: 'Enfermedad o síntoma.' },
  { to: '/hacer-nota/trate', icon: Pill, label: 'Traté', description: 'Tratamiento con medicamento.' },
  { to: '/hacer-nota/preñez', icon: Sparkles, label: 'Detecté preñez', description: 'Chequeo de preñez.' },
  { to: '/hacer-nota/parto', icon: Baby, label: 'Parió una vaca', description: 'Anotar un parto.' },
  // Manejo del ciclo
  { to: '/hacer-nota/seque', icon: MilkOff, label: 'Sequé', description: 'Vaca al descanso.' },
  { to: '/hacer-nota/destete', icon: GraduationCap, label: 'Desteté', description: 'Destete de becerro.' },
  { to: '/hacer-nota/aborto', icon: HeartCrack, label: 'Aborto', description: 'Pérdida de gestación.' },
  // Ocasional
  { to: '/animales/nuevo', icon: ShoppingCart, label: 'Compré animal', description: 'Agregar un animal nuevo.' },
  { to: '/panel/dinero/ventas-animales', icon: Handshake, label: 'Vendí animal', description: 'Registrar la venta.' }
];

// Orden de paneles: lo que se consulta a diario primero; reportes al
// final como cierre analitico.
const PANELES: Tile[] = [
  { to: '/panel/produccion', icon: Beef, label: 'Producción', description: 'Pesajes, ordeños, curvas.' },
  { to: '/panel/alimentacion', icon: Wheat, label: 'Alimentación', description: 'Insumos, planes y consumo.' },
  { to: '/panel/dinero', icon: DollarSign, label: 'Dinero', description: 'Gastos, ingresos y resumen.' },
  { to: '/panel/salud', icon: HeartPulse, label: 'Salud', description: 'Vacunas, diagnósticos y alertas.' },
  { to: '/panel/reproduccion', icon: Baby, label: 'Reproducción', description: 'Celos, servicios, partos.' },
  { to: '/panel/reportes', icon: FileBarChart, label: 'Reportes', description: 'Inventario, históricos.' }
];

/**
 * Pantalla unica "Hoy". Combina agenda (lo que hay que hacer hoy),
 * acciones rapidas (registrar lo que pasa) y paneles (ver detalle).
 * Reemplaza tanto la antigua Inicio como Hacer una nota.
 */
export default function InicioPage() {
  const agenda = useAgendaToday();
  const alerts = usePredictiveAlerts();

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
    const meta = TASK_META[item.type] ?? { icon: Sparkles, color: 'text-muted-foreground', label: item.type };
    allTasks.push({
      key: `agenda-${item.type}-${item.animalId}-${item.dueDate}`,
      icon: meta.icon, color: meta.color, label: meta.label,
      message: item.message,
      detail: item.animalTag ? `Animal ${item.animalTag}` : (item.lotName ?? ''),
      severity: item.severity,
      to: item.animalId ? `/animales/${item.animalId}` : '/animales'
    });
  }
  for (const a of alerts.data ?? []) {
    const meta = TASK_META[a.type] ?? { icon: Sparkles, color: 'text-muted-foreground', label: a.type };
    allTasks.push({
      key: `alert-${a.type}-${a.animalId}`,
      icon: meta.icon, color: meta.color, label: meta.label,
      message: a.detail, detail: `Animal ${a.animalTag}`,
      severity: a.severity, to: `/animales/${a.animalId}`
    });
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sun className="h-6 w-6 text-amber-500" aria-hidden />
          Hoy en tu rancho
        </h1>
        <p className="text-muted-foreground">
          Tus pendientes, lo que quieras registrar y todos los paneles en un solo lugar.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" aria-hidden />
          Pendientes
        </h2>
        {agenda.isLoading || alerts.isLoading ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : allTasks.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Todo al día"
            description="Cuando haya vacunas próximas, partos esperados o vacas sin pesar aparecerán aquí."
          />
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allTasks.map(t => {
              const Icon = t.icon;
              return (
                <li key={t.key}>
                  <Link
                    to={t.to}
                    className={`flex gap-3 rounded-xl border p-4 hover:bg-accent transition-colors ${SEVERITY_BG[t.severity] ?? 'border-input'}`}
                  >
                    <Icon className={`h-8 w-8 mt-0.5 shrink-0 ${t.color}`} aria-hidden />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.label}</p>
                      <p className="font-semibold leading-tight">{t.message}</p>
                      {t.detail ? <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.detail}</p> : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Egg className="h-5 w-5 text-primary" aria-hidden />
          Registrar
        </h2>
        <p className="text-sm text-muted-foreground">
          Toca una acción para anotar algo que pasó en el rancho.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACCIONES.map(a => <TileLink key={a.label} {...a} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" aria-hidden />
          Ver paneles
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PANELES.map(p => <TileLink key={p.label} {...p} />)}
        </div>
      </section>
    </div>
  );
}

function TileLink({ to, icon: Icon, label, description }: Tile) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-background p-5 hover:bg-accent hover:border-primary/40 transition-colors min-h-32 text-center"
    >
      <Icon className="h-10 w-10 text-primary" aria-hidden />
      <span className="text-base font-semibold leading-tight">{label}</span>
      <span className="text-xs text-muted-foreground leading-snug">{description}</span>
    </Link>
  );
}
