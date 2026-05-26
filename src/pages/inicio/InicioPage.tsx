/**
 * Esta pagina es la portada del usuario y combina pendientes, captura y acceso a paneles.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Syringe, Baby, Scale, Pill, AlertTriangle, Sparkles, Sun, Stethoscope,
  Milk, MilkOff, Wheat, ShoppingCart, Handshake, MinusCircle, PlusCircle, Heart,
  HeartPulse, DollarSign, Beef, FileBarChart, Egg, Droplet, GraduationCap, HeartCrack,
  type LucideIcon
} from 'lucide-react';
import { useAgendaToday, usePredictiveAlerts } from '@/features/agenda/api';
import { EmptyState } from '@/components/ui/empty-state';

const SEVERITY_BG: Record<string, string> = {
  high:   'border-red-300 bg-red-50 dark:bg-red-950/30',
  medium: 'border-amber-300 bg-amber-50 dark:bg-amber-950/30',
  low:    'border-input'
};

type TaskType = 'VACCINATION' | 'CALVING' | 'WEIGHING_OVERDUE' | 'TREATMENT_OPEN' | 'LONG_OPEN_DAYS' | 'MILK_DROP';

const TASK_ICON: Record<string, { icon: LucideIcon; color: string }> = {
  VACCINATION:      { icon: Syringe,        color: 'text-sky-700' },
  CALVING:          { icon: Baby,           color: 'text-pink-700' },
  WEIGHING_OVERDUE: { icon: Scale,          color: 'text-amber-700' },
  TREATMENT_OPEN:   { icon: Pill,           color: 'text-red-700' },
  LONG_OPEN_DAYS:   { icon: Baby,           color: 'text-purple-700' },
  MILK_DROP:        { icon: AlertTriangle,  color: 'text-red-700' }
};

interface Tile { to: string; icon: LucideIcon; label: string; description: string }

export default function InicioPage() {
  const { t } = useTranslation(['dashboard', 'common']);

  const ACCIONES: Tile[] = [
    { to: '/hacer-nota/alimentar',  icon: Wheat,       label: t('dashboard:inicio.acciones.alimenteLabel'),   description: t('dashboard:inicio.acciones.alimenteDesc') },
    { to: '/hacer-nota/ordene',     icon: Milk,        label: t('dashboard:inicio.acciones.ordeneLabel'),     description: t('dashboard:inicio.acciones.ordeneDesc') },
    { to: '/hacer-nota/gaste',      icon: MinusCircle, label: t('dashboard:inicio.acciones.gasteLabel'),      description: t('dashboard:inicio.acciones.gasteDesc') },
    { to: '/hacer-nota/recibi',     icon: PlusCircle,  label: t('dashboard:inicio.acciones.recibiLabel'),     description: t('dashboard:inicio.acciones.recibiDesc') },
    { to: '/hacer-nota/pese',       icon: Scale,       label: t('dashboard:inicio.acciones.peseLabel'),       description: t('dashboard:inicio.acciones.peseDesc') },
    { to: '/hacer-nota/celo',       icon: Heart,       label: t('dashboard:inicio.acciones.celoLabel'),       description: t('dashboard:inicio.acciones.celoDesc') },
    { to: '/hacer-nota/servi',      icon: Droplet,     label: t('dashboard:inicio.acciones.serviLabel'),      description: t('dashboard:inicio.acciones.serviDesc') },
    { to: '/hacer-nota/vacune',     icon: Syringe,     label: t('dashboard:inicio.acciones.vacuneLabel'),     description: t('dashboard:inicio.acciones.vacuneDesc') },
    { to: '/hacer-nota/diagnostique', icon: Stethoscope, label: t('dashboard:inicio.acciones.diagnostiqueLabel'), description: t('dashboard:inicio.acciones.diagnostiqueDesc') },
    { to: '/hacer-nota/trate',      icon: Pill,        label: t('dashboard:inicio.acciones.trateLabel'),      description: t('dashboard:inicio.acciones.trateDesc') },
    { to: '/hacer-nota/preñez',     icon: Sparkles,    label: t('dashboard:inicio.acciones.preneLabel'),      description: t('dashboard:inicio.acciones.preneDesc') },
    { to: '/hacer-nota/parto',      icon: Baby,        label: t('dashboard:inicio.acciones.partoLabel'),      description: t('dashboard:inicio.acciones.partoDesc') },
    { to: '/hacer-nota/seque',      icon: MilkOff,     label: t('dashboard:inicio.acciones.sequeLabel'),      description: t('dashboard:inicio.acciones.sequeDesc') },
    { to: '/hacer-nota/destete',    icon: GraduationCap, label: t('dashboard:inicio.acciones.desteteLabel'), description: t('dashboard:inicio.acciones.desteteDesc') },
    { to: '/hacer-nota/aborto',     icon: HeartCrack,  label: t('dashboard:inicio.acciones.abortoLabel'),     description: t('dashboard:inicio.acciones.abortoDesc') },
    { to: '/animales/nuevo',        icon: ShoppingCart, label: t('dashboard:inicio.acciones.compreLabel'),    description: t('dashboard:inicio.acciones.compreDesc') },
    { to: '/panel/dinero/ventas-animales', icon: Handshake, label: t('dashboard:inicio.acciones.vendiLabel'), description: t('dashboard:inicio.acciones.vendiDesc') }
  ];

  const PANELES: Tile[] = [
    { to: '/panel/produccion',   icon: Beef,        label: t('dashboard:inicio.panelTiles.produccionLabel'),   description: t('dashboard:inicio.panelTiles.produccionDesc') },
    { to: '/panel/alimentacion', icon: Wheat,       label: t('dashboard:inicio.panelTiles.alimentacionLabel'), description: t('dashboard:inicio.panelTiles.alimentacionDesc') },
    { to: '/panel/dinero',       icon: DollarSign,  label: t('dashboard:inicio.panelTiles.dineroLabel'),       description: t('dashboard:inicio.panelTiles.dineroDesc') },
    { to: '/panel/salud',        icon: HeartPulse,  label: t('dashboard:inicio.panelTiles.saludLabel'),        description: t('dashboard:inicio.panelTiles.saludDesc') },
    { to: '/panel/reproduccion', icon: Baby,        label: t('dashboard:inicio.panelTiles.reproduccionLabel'), description: t('dashboard:inicio.panelTiles.reproduccionDesc') },
    { to: '/panel/reportes',     icon: FileBarChart, label: t('dashboard:inicio.panelTiles.reportesLabel'),   description: t('dashboard:inicio.panelTiles.reportesDesc') }
  ];

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
    const meta = TASK_ICON[item.type] ?? { icon: Sparkles, color: 'text-muted-foreground' };
    allTasks.push({
      key: `agenda-${item.type}-${item.animalId}-${item.dueDate}`,
      icon: meta.icon, color: meta.color,
      label: t(`dashboard:inicio.task.${item.type as TaskType}`, { defaultValue: item.type }),
      message: item.message,
      detail: item.animalTag ? `${t('dashboard:inicio.animalTag')} ${item.animalTag}` : (item.lotName ?? ''),
      severity: item.severity,
      to: item.animalId ? `/animales/${item.animalId}` : '/animales'
    });
  }
  for (const a of alerts.data ?? []) {
    const meta = TASK_ICON[a.type] ?? { icon: Sparkles, color: 'text-muted-foreground' };
    allTasks.push({
      key: `alert-${a.type}-${a.animalId}`,
      icon: meta.icon, color: meta.color,
      label: t(`dashboard:inicio.task.${a.type as TaskType}`, { defaultValue: a.type }),
      message: a.detail,
      detail: `${t('dashboard:inicio.animalTag')} ${a.animalTag}`,
      severity: a.severity, to: `/animales/${a.animalId}`
    });
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sun className="h-6 w-6 text-amber-500" aria-hidden />
          {t('dashboard:inicio.heading')}
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard:inicio.subtitle')}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" aria-hidden />
          {t('dashboard:inicio.pendientes')}
        </h2>
        {agenda.isLoading || alerts.isLoading ? (
          <p className="text-muted-foreground">{t('dashboard:inicio.loading')}</p>
        ) : allTasks.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={t('dashboard:inicio.allGood')}
            description={t('dashboard:inicio.allGoodDesc')}
          />
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allTasks.map(task => {
              const Icon = task.icon;
              return (
                <li key={task.key}>
                  <Link
                    to={task.to}
                    className={`flex gap-3 rounded-xl border p-4 hover:bg-accent transition-colors ${SEVERITY_BG[task.severity] ?? 'border-input'}`}
                  >
                    <Icon className={`h-8 w-8 mt-0.5 shrink-0 ${task.color}`} aria-hidden />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{task.label}</p>
                      <p className="font-semibold leading-tight">{task.message}</p>
                      {task.detail ? <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.detail}</p> : null}
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
          {t('dashboard:inicio.registrar')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('dashboard:inicio.registrarSubtitle')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACCIONES.map(a => <TileLink key={a.to} {...a} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" aria-hidden />
          {t('dashboard:inicio.paneles')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PANELES.map(p => <TileLink key={p.to} {...p} />)}
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
