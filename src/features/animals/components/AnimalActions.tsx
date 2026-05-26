/**
 * Este componente agrupa los botones de accion del modulo animals.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Syringe, Scale, Pill, Stethoscope, Milk, Wheat,
  Heart, Sparkles, Baby, MinusCircle, Handshake, Skull,
  Cloud, type LucideIcon
} from 'lucide-react';
import type { AnimalResponse } from '@/features/animals/types';

interface Action {
  to: string;
  icon: LucideIcon;
  labelKey: string;
  descKey: string;
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
  const { t } = useTranslation('animals');
  const aid = animal.id;
  const isFemale = animal.sex === 'FEMALE';
  const isActive = animal.status === 'ACTIVE';

  const all: Action[] = [
    { to: `/hacer-nota/pese?animalId=${aid}`,      icon: Scale,       labelKey: 'actionItems.weigh.label',        descKey: 'actionItems.weigh.desc' },
    { to: `/hacer-nota/alimentar?animalId=${aid}`,  icon: Wheat,       labelKey: 'actionItems.feed.label',         descKey: 'actionItems.feed.desc' },
    { to: `/hacer-nota/ordene?animalId=${aid}`,     icon: Milk,        labelKey: 'actionItems.milk.label',         descKey: 'actionItems.milk.desc',         sex: 'FEMALE' },
    { to: `/hacer-nota/vacune?animalId=${aid}`,     icon: Syringe,     labelKey: 'actionItems.vaccinate.label',    descKey: 'actionItems.vaccinate.desc' },
    { to: `/panel/salud/diagnosticos?animalId=${aid}`, icon: Stethoscope, labelKey: 'actionItems.diagnose.label', descKey: 'actionItems.diagnose.desc' },
    { to: `/panel/salud/tratamientos?animalId=${aid}`, icon: Pill,      labelKey: 'actionItems.treat.label',       descKey: 'actionItems.treat.desc' },
    { to: `/panel/reproduccion?tab=heats&animalId=${aid}`,            icon: Heart,    labelKey: 'actionItems.heat.label',           descKey: 'actionItems.heat.desc',     sex: 'FEMALE' },
    { to: `/panel/reproduccion?tab=services&animalId=${aid}`,         icon: Sparkles, labelKey: 'actionItems.service.label',        descKey: 'actionItems.service.desc',  sex: 'FEMALE' },
    { to: `/panel/reproduccion?tab=pregnancy-checks&animalId=${aid}`, icon: Sparkles, labelKey: 'actionItems.pregCheck.label',      descKey: 'actionItems.pregCheck.desc',sex: 'FEMALE' },
    { to: `/panel/reproduccion?tab=calvings&animalId=${aid}`,         icon: Baby,     labelKey: 'actionItems.calving.label',        descKey: 'actionItems.calving.desc',  sex: 'FEMALE' },
    { to: `/panel/reproduccion?tab=dry-offs&animalId=${aid}`,         icon: Milk,     labelKey: 'actionItems.dryOff.label',         descKey: 'actionItems.dryOff.desc',   sex: 'FEMALE' },
    { to: `/panel/salud?tab=plans&animalId=${aid}`,        icon: Cloud,       labelKey: 'actionItems.healthPlan.label',   descKey: 'actionItems.healthPlan.desc' },
    { to: `/hacer-nota/gaste?animalId=${aid}`,             icon: MinusCircle, labelKey: 'actionItems.expense.label',      descKey: 'actionItems.expense.desc' }
  ];

  const endOfLife: Action[] = isActive ? [
    { to: `/panel/produccion?tab=slaughter&animalId=${aid}`, icon: Skull,    labelKey: 'actionItems.slaughter.label', descKey: 'actionItems.slaughter.desc' },
    { to: `/panel/dinero/ventas-animales?animalId=${aid}`,   icon: Handshake, labelKey: 'actionItems.sell.label',     descKey: 'actionItems.sell.desc' }
  ] : [];

  const visible = all.filter(a => !a.sex || a.sex === animal.sex);
  if (!isFemale && visible.length === 0) return null;

  return (
    <section aria-label={t('actions.actionsLabel')} className="space-y-3">
      <h2 className="text-lg font-semibold">{t('actions.todayQuestion')}</h2>
      <p className="text-sm text-muted-foreground">
        {t('actions.todayDescription')}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {visible.map(a => <ActionTile key={a.labelKey} action={a} />)}
      </div>
      {endOfLife.length > 0 ? (
        <details className="mt-2">
          <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            {t('actions.endOfLifeSummary')}
          </summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
            {endOfLife.map(a => <ActionTile key={a.labelKey} action={a} variant="danger" />)}
          </div>
        </details>
      ) : null}
    </section>
  );
}

function ActionTile({ action, variant }: { action: Action; variant?: 'danger' }) {
  const { t } = useTranslation('animals');
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
      <span className="text-sm font-semibold leading-tight">{t(action.labelKey, { defaultValue: action.labelKey })}</span>
      <span className="text-[11px] text-muted-foreground leading-snug">{t(action.descKey, { defaultValue: action.descKey })}</span>
    </Link>
  );
}
