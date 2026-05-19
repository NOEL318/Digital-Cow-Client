/**
 * Este componente es una pestana del detalle del modulo animals.
 */
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Syringe, Stethoscope, Baby, AlertTriangle, Milk, MoonStar
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAnimalHeats } from '@/features/reproduction/heats/api';
import { useAnimalServiceEvents } from '@/features/reproduction/services/api';
import { useAnimalPregnancyChecks } from '@/features/reproduction/pregnancyChecks/api';
import { useAnimalCalvings } from '@/features/reproduction/calvings/api';
import { useAnimalAbortions } from '@/features/reproduction/abortions/api';
import { useAnimalWeanings } from '@/features/reproduction/weanings/api';
import { useAnimalDryOffs } from '@/features/reproduction/dryOffs/api';

interface TimelineItem {
  key: string;
  date: string;
  type: 'heat' | 'service' | 'pregnancyCheck' | 'calving' | 'abortion' | 'weaning' | 'dryOff';
  icon: LucideIcon;
  details: string;
}

const ICONS: Record<TimelineItem['type'], LucideIcon> = {
  heat: Sparkles,
  service: Syringe,
  pregnancyCheck: Stethoscope,
  calving: Baby,
  abortion: AlertTriangle,
  weaning: Milk,
  dryOff: MoonStar
};

/** Devuelve solo la parte YYYY-MM-DD de una fecha ISO. */
function dayOf(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * Tab Reproduccion del detalle de animal: timeline cronologico desc
 * combinando heats, services, pregnancy checks, calvings, abortions,
 * weanings y dry-offs del animal.
 */
export function AnimalReproductionTab() {
  const { id } = useParams();
  const animalId = Number(id);
  const { t } = useTranslation(['reproduction', 'common']);

  const heats = useAnimalHeats(animalId);
  const services = useAnimalServiceEvents(animalId);
  const checks = useAnimalPregnancyChecks(animalId);
  const calvings = useAnimalCalvings(animalId);
  const abortions = useAnimalAbortions(animalId);
  const weanings = useAnimalWeanings(animalId);
  const dryOffs = useAnimalDryOffs(animalId);

  const items: TimelineItem[] = useMemo(() => {
    const list: TimelineItem[] = [];
    heats.data?.forEach(h => list.push({
      key: `heat-${h.id}`,
      date: dayOf(h.detectedAt),
      type: 'heat',
      icon: ICONS.heat,
      details: [h.detectionMethod, h.intensity].filter(Boolean).join(' - ')
    }));
    services.data?.forEach(s => list.push({
      key: `service-${s.id}`,
      date: dayOf(s.serviceDate),
      type: 'service',
      icon: ICONS.service,
      details: [s.serviceType, s.technicianName].filter(Boolean).join(' - ')
    }));
    checks.data?.forEach(c => list.push({
      key: `pc-${c.id}`,
      date: dayOf(c.checkedAt),
      type: 'pregnancyCheck',
      icon: ICONS.pregnancyCheck,
      details: [c.result, c.estimatedCalvingDate ? `${t('reproduction:pregnancy.estimatedCalvingDate')}: ${c.estimatedCalvingDate}` : null].filter(Boolean).join(' - ')
    }));
    calvings.data?.forEach(c => list.push({
      key: `calv-${c.id}`,
      date: dayOf(c.calvedAt),
      type: 'calving',
      icon: ICONS.calving,
      details: [c.ease, c.outcome, c.calfSex].filter(Boolean).join(' - ')
    }));
    abortions.data?.forEach(a => list.push({
      key: `abort-${a.id}`,
      date: dayOf(a.abortedAt),
      type: 'abortion',
      icon: ICONS.abortion,
      details: a.cause ?? ''
    }));
    weanings.data?.forEach(w => list.push({
      key: `wean-${w.id}`,
      date: dayOf(w.weanedAt),
      type: 'weaning',
      icon: ICONS.weaning,
      details: w.weightKg ? `${w.weightKg} kg` : ''
    }));
    dryOffs.data?.forEach(d => list.push({
      key: `do-${d.id}`,
      date: dayOf(d.driedOffAt),
      type: 'dryOff',
      icon: ICONS.dryOff,
      details: d.lactationDays ? `${d.lactationDays} d` : ''
    }));
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [heats.data, services.data, checks.data, calvings.data, abortions.data, weanings.data, dryOffs.data, t]);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{t('reproduction:tab.timeline')}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('common:empty', { defaultValue: '-' })}</p>
      ) : (
        <ul className="space-y-2">
          {items.map(it => {
            const Icon = it.icon;
            return (
              <li key={it.key} className="border rounded p-3 flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{t(`reproduction:timeline.${it.type}`)}</span>
                    <span className="text-muted-foreground">{it.date}</span>
                  </div>
                  {it.details && <p className="text-sm text-muted-foreground mt-1">{it.details}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
