import { Link } from 'react-router-dom';
import {
  Syringe, Scale, Pill, Stethoscope, Milk, Wheat,
  Heart, Sparkles, Baby, MinusCircle, Handshake, Skull,
  Cloud, type LucideIcon
} from 'lucide-react';
import type { AnimalResponse } from '@/features/animals/types';

interface Action {
  to: string;
  icon: LucideIcon;
  label: string;
  description: string;
  /** Solo se muestra si el sexo coincide. */
  sex?: 'FEMALE' | 'MALE';
}

interface AnimalActionsProps {
  animal: AnimalResponse;
}

/**
 * Acciones registrables que se pueden hacer al animal. Cada tarjeta
 * navega al wizard correspondiente con ?animalId= para que llegue
 * preseleccionada. Las acciones se filtran por sexo y estado
 * (vender solo si está activa, ordeñar solo en hembras, etc.).
 */
export function AnimalActions({ animal }: AnimalActionsProps) {
  const aid = animal.id;
  const isFemale = animal.sex === 'FEMALE';
  const isActive = animal.status === 'ACTIVE';

  const all: Action[] = [
    // Diarias / muy frecuentes
    { to: `/hacer-nota/pese?animalId=${aid}`,     icon: Scale,       label: 'Pesar',          description: 'Registrar peso.' },
    { to: `/hacer-nota/alimentar?animalId=${aid}`, icon: Wheat,      label: 'Alimentar',      description: 'Comida individual.' },
    { to: `/hacer-nota/ordene?animalId=${aid}`,   icon: Milk,        label: 'Ordeñar',        description: 'Registrar ordeño.', sex: 'FEMALE' },

    // Salud
    { to: `/hacer-nota/vacune?animalId=${aid}`,   icon: Syringe,     label: 'Vacunar',        description: 'Aplicar una vacuna.' },
    { to: `/panel/salud/diagnosticos?animalId=${aid}`, icon: Stethoscope, label: 'Diagnosticar', description: 'Anotar síntoma o enfermedad.' },
    { to: `/panel/salud/tratamientos?animalId=${aid}`, icon: Pill,    label: 'Tratar',         description: 'Aplicar medicamento.' },

    // Reproducción (solo hembras)
    { to: `/panel/reproduccion?tab=heats&animalId=${aid}`,             icon: Heart,    label: 'Vi un celo',     description: 'Anotar celo detectado.',   sex: 'FEMALE' },
    { to: `/panel/reproduccion?tab=services&animalId=${aid}`,          icon: Sparkles, label: 'Servicio o monta', description: 'Inseminación o monta.',  sex: 'FEMALE' },
    { to: `/panel/reproduccion?tab=pregnancy-checks&animalId=${aid}`,  icon: Sparkles, label: 'Detectar preñez', description: 'Chequeo de preñez.',     sex: 'FEMALE' },
    { to: `/panel/reproduccion?tab=calvings&animalId=${aid}`,          icon: Baby,     label: 'Registrar parto', description: 'Anotar parto reciente.', sex: 'FEMALE' },
    { to: `/panel/reproduccion?tab=dry-offs&animalId=${aid}`,          icon: Milk,     label: 'Secar',           description: 'Marcar como seca.',      sex: 'FEMALE' },

    // Otros eventos
    { to: `/panel/salud?tab=plans&animalId=${aid}`,           icon: Cloud,         label: 'Asignar plan sanitario', description: 'Plan de vacunación.' },
    { to: `/hacer-nota/gaste?animalId=${aid}`,                icon: MinusCircle,   label: 'Registrar gasto', description: 'Gasto asociado al animal.' },
  ];

  // Acciones de fin de ciclo (solo si está activa)
  const endOfLife: Action[] = isActive ? [
    { to: `/panel/produccion?tab=slaughter&animalId=${aid}`, icon: Skull,    label: 'Sacrificio', description: 'Registrar sacrificio.' },
    { to: `/panel/dinero/ventas-animales?animalId=${aid}`,    icon: Handshake, label: 'Vender',     description: 'Registrar la venta.' }
  ] : [];

  const visible = all.filter(a => !a.sex || a.sex === animal.sex);
  if (!isFemale && visible.length === 0) return null;

  return (
    <section aria-label="Acciones para esta vaca" className="space-y-3">
      <h2 className="text-lg font-semibold">¿Qué le hiciste hoy?</h2>
      <p className="text-sm text-muted-foreground">
        Toca una acción para registrarla. La vaca queda preseleccionada.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {visible.map(a => <ActionTile key={a.label} action={a} />)}
      </div>
      {endOfLife.length > 0 ? (
        <details className="mt-2">
          <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            Acciones menos comunes (fin de ciclo)
          </summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
            {endOfLife.map(a => <ActionTile key={a.label} action={a} variant="danger" />)}
          </div>
        </details>
      ) : null}
    </section>
  );
}

function ActionTile({ action, variant }: { action: Action; variant?: 'danger' }) {
  const Icon = action.icon;
  const colorBase = variant === 'danger'
    ? 'border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30'
    : 'border-input hover:bg-accent hover:border-primary/40';
  return (
    <Link
      to={action.to}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border bg-background p-3 text-center transition-colors min-h-24 ${colorBase}`}
    >
      <Icon className={`h-6 w-6 ${variant === 'danger' ? 'text-red-700' : 'text-primary'}`} aria-hidden />
      <span className="text-sm font-semibold leading-tight">{action.label}</span>
      <span className="text-[11px] text-muted-foreground leading-snug">{action.description}</span>
    </Link>
  );
}
