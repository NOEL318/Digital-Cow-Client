/**
 * Este componente pertenece al modulo ranches y se ocupa de RanchRecentEvents.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { animalsApi } from '@/features/animals/api';
import { useVaccinations } from '@/features/health/vaccinations/api';
import { useDiagnoses } from '@/features/health/diagnoses/api';
import { useTreatments } from '@/features/health/treatments/api';
import { useCalvings } from '@/features/reproduction/calvings/api';
import { useMilkings } from '@/features/production/milkings/api';
import { useAnimalSales } from '@/features/finance/animalSales/api';
import { toArray } from '@/lib/page';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { AnimalListItem, Page } from '@/features/animals/types';

interface Props {
  /** Id del rancho cuyos eventos recientes se muestran. */
  ranchId: number;
}

type EventKind = 'vaccination' | 'diagnosis' | 'treatment' | 'calving' | 'milking' | 'sale';

type EventRow = {
  id: string;
  date: string;
  kind: EventKind;
  label: string;
  animalTag?: string;
};

const KIND_TONE: Record<EventKind, 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'primary'> = {
  vaccination: 'success',
  diagnosis: 'warning',
  treatment: 'info',
  calving: 'primary',
  milking: 'neutral',
  sale: 'danger'
};

/**
 * Mezcla los ultimos eventos (vacunaciones, diagnosticos, tratamientos, partos,
 * ordeños, ventas) de animales del rancho. Filtra client-side por animales del rancho.
 */
export function RanchRecentEvents({ ranchId }: Props) {
  const { t } = useTranslation('ranches');

  const animals = useQuery({
    queryKey: ['animals', { ranchId, size: 500, page: 0 }],
    queryFn: () => animalsApi.list({ ranchId, size: 500, page: 0 })
  });
  const vaccinations = useVaccinations();
  const diagnoses = useDiagnoses();
  const treatments = useTreatments();
  const calvings = useCalvings();
  const milkings = useMilkings();
  const sales = useAnimalSales();

  const ranchAnimals = useMemo(() => {
    const content = (animals.data as Page<AnimalListItem> | undefined)?.content ?? [];
    const map = new Map<number, string>();
    for (const a of content) map.set(a.id, a.internalTag);
    return map;
  }, [animals.data]);

  const events = useMemo<EventRow[]>(() => {
    const tagOf = (id: number | null | undefined) => (id != null ? ranchAnimals.get(id) : undefined);
    const inRanch = (id: number | null | undefined) => id != null && ranchAnimals.has(id);
    const rows: EventRow[] = [];

    for (const v of vaccinations.data ?? []) {
      if (!inRanch(v.animalId)) continue;
      rows.push({
        id: `vac-${v.id}`,
        date: v.appliedAt,
        kind: 'vaccination',
        label: v.vaccineNameEs ?? v.vaccineCode ?? '',
        animalTag: tagOf(v.animalId)
      });
    }
    for (const d of diagnoses.data ?? []) {
      if (!inRanch(d.animalId)) continue;
      rows.push({
        id: `dia-${d.id}`,
        date: d.diagnosedAt,
        kind: 'diagnosis',
        label: d.diseaseNameEs ?? d.diseaseCode ?? '',
        animalTag: tagOf(d.animalId)
      });
    }
    for (const tr of treatments.data ?? []) {
      if (!inRanch(tr.animalId)) continue;
      rows.push({
        id: `tre-${tr.id}`,
        date: tr.startedAt,
        kind: 'treatment',
        label: tr.medicationNameEs ?? tr.medicationCode ?? '',
        animalTag: tagOf(tr.animalId)
      });
    }
    for (const c of calvings.data ?? []) {
      if (!inRanch(c.animalId)) continue;
      rows.push({
        id: `cal-${c.id}`,
        date: c.calvedAt,
        kind: 'calving',
        label: c.outcome,
        animalTag: tagOf(c.animalId)
      });
    }
    for (const m of milkings.data ?? []) {
      if (!inRanch(m.animalId)) continue;
      rows.push({
        id: `mil-${m.id}`,
        date: m.milkingDate,
        kind: 'milking',
        label: `${m.liters} L (${m.session})`,
        animalTag: tagOf(m.animalId)
      });
    }
    const salesRows = toArray<{ id: number; animalId: number; soldAt?: string; saleDate?: string; salePrice?: number | string; amount?: number | string }>(sales.data);
    for (const s of salesRows) {
      if (!inRanch(s.animalId)) continue;
      const date = s.soldAt ?? s.saleDate ?? '';
      const amount = s.salePrice ?? s.amount;
      rows.push({
        id: `sal-${s.id}`,
        date,
        kind: 'sale',
        label: amount != null ? String(amount) : '',
        animalTag: tagOf(s.animalId)
      });
    }

    return rows
      .filter(r => r.date)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, 10);
  }, [vaccinations.data, diagnoses.data, treatments.data, calvings.data, milkings.data, sales.data, ranchAnimals]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('detail.eventDate')}</TableHead>
          <TableHead>{t('detail.eventType')}</TableHead>
          <TableHead>{t('detail.eventAnimal')}</TableHead>
          <TableHead>{t('detail.eventDetail')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
              {t('detail.noEvents')}
            </TableCell>
          </TableRow>
        ) : events.map(e => (
          <TableRow key={e.id}>
            <TableCell>{e.date}</TableCell>
            <TableCell>
              <Badge tone={KIND_TONE[e.kind]}>{t(`detail.kind.${e.kind}`)}</Badge>
            </TableCell>
            <TableCell>{e.animalTag ?? '-'}</TableCell>
            <TableCell>{e.label}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
