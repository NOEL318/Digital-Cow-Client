import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { useTranslation } from 'react-i18next';
import {
  Edit2, Handshake, Camera, Activity, BarChart3, Share2, Milk, Baby, Move,
  type LucideIcon
} from 'lucide-react';
import { animalsApi } from '@/features/animals/api';
import { PhotoUploader } from '@/features/animals/components/PhotoUploader';
import { PhotoGallery } from '@/features/animals/components/PhotoGallery';
import { AnimalHero } from '@/features/animals/components/AnimalHero';
import { SellAnimalDialog } from '@/features/animals/components/SellAnimalDialog';
import { MoveAnimalLotDialog } from '@/features/animals/components/MoveAnimalLotDialog';
import { AnimalShareCard } from '@/features/animals/components/AnimalShareCard';
import { AnimalActions } from '@/features/animals/components/AnimalActions';
import { ComparisonChart } from '@/components/comparison-chart';
import { AnimalHealthTab } from '@/features/animals/components/AnimalHealthTab';
import { AnimalReproductionTab } from '@/features/animals/components/AnimalReproductionTab';
import { AnimalProductionTab } from '@/features/animals/components/AnimalProductionTab';
import { AnimalFinanceTab } from '@/features/animals/components/AnimalFinanceTab';
import { useAnimalLactation } from '@/features/agenda/api';
import { BigButton } from '@/components/ui/big-button';

/**
 * Vista detalle del animal: foto principal, badges de estado
 * lactacional (DEL, seca, último parto, promedio reciente) y solo
 * tres tabs (Datos y fotos · Su historia · Dinero y comparar).
 */
export default function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const animalId = Number(id);
  const { t } = useTranslation(['animals', 'common']);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['animal', animalId], queryFn: () => animalsApi.get(animalId) });
  const lactation = useAnimalLactation(animalId);
  const [sellOpen, setSellOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);

  if (!q.data) return <div>{t('common:loading')}</div>;
  const a = q.data;
  const canSell = a.status === 'ACTIVE';
  const canMove = a.status === 'ACTIVE';
  const lac = lactation.data;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <AnimalHero
        animalId={a.id}
        internalTag={a.internalTag}
        name={a.name}
        coverPhotoId={a.coverPhotoId}
      />

      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">{a.internalTag}{a.name ? ` · ${a.name}` : ''}</h1>
          <p className="text-sm text-muted-foreground">
            {t(`animals:sex.${a.sex}`)} · {t(`animals:status.${a.status}`)}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {canSell ? (
            <BigButton label="Vender" icon={Handshake} variant="primary" onClick={() => setSellOpen(true)} />
          ) : null}
          {canMove ? (
            <BigButton label="Mover de lote" icon={Move} variant="outline" onClick={() => setMoveOpen(true)} />
          ) : null}
          <BigButton label="Compartir" icon={Share2} variant="outline" onClick={() => setShareOpen(true)} />
          <BigButton
            label={t('common:actions.edit')}
            icon={Edit2}
            variant="outline"
            onClick={() => window.location.assign(`/animales/${a.id}/editar`)}
          />
        </div>
      </header>

      {lac && (lac.daysInMilk != null || lac.dry || lac.lastCalving) ? (
        <div className="flex flex-wrap gap-2">
          {lac.dry ? (
            <Badge tone="amber" icon={Milk} label="Seca" />
          ) : lac.daysInMilk != null ? (
            <Badge tone="green" icon={Milk} label={`${lac.daysInMilk} días en leche`} />
          ) : null}
          {lac.lastCalving ? (
            <Badge tone="pink" icon={Baby} label={`Último parto: ${lac.lastCalving}`} />
          ) : null}
          {lac.recentAvgLiters != null && !lac.dry ? (
            <Badge tone="blue" icon={Milk} label={`Promedio reciente: ${lac.recentAvgLiters} litros/día`} />
          ) : null}
        </div>
      ) : null}

      <SellAnimalDialog
        open={sellOpen}
        animalId={a.id}
        internalTag={a.internalTag}
        onClose={() => setSellOpen(false)}
        onSold={() => qc.invalidateQueries({ queryKey: ['animal', a.id] })}
      />

      <MoveAnimalLotDialog
        open={moveOpen}
        animalId={a.id}
        internalTag={a.internalTag}
        currentRanchId={a.ranchId}
        currentLotId={a.lotId}
        onClose={() => setMoveOpen(false)}
      />

      <AnimalShareCard
        open={shareOpen}
        animal={a}
        coverPhotoUrl={a.coverPhotoUrl}
        daysInMilk={lac?.daysInMilk}
        lastCalving={lac?.lastCalving}
        onClose={() => setShareOpen(false)}
      />

      {/* Acciones contextuales: qué le puedo registrar a esta vaca. */}
      <AnimalActions animal={a} />

      <Tabs.Root defaultValue="datos" className="space-y-4">
        <Tabs.List className="grid grid-cols-3 border rounded-xl overflow-hidden">
          <TabHead value="datos" icon={Camera} label="Datos y fotos" />
          <TabHead value="historia" icon={Activity} label="Su historia" />
          <TabHead value="dinero" icon={BarChart3} label="Dinero y comparar" />
        </Tabs.List>

        <Tabs.Content value="datos" className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Identificación</h2>
            <div className="rounded-xl border divide-y">
              <Field label={t('animals:fields.officialTag')} value={a.officialTag ?? '-'} />
              <Field label={t('animals:fields.rfid')} value={a.rfid ?? '-'} />
              <Field label={t('animals:fields.birthDate')} value={a.birthDate ?? '-'} />
              <Field label={t('animals:fields.purpose')} value={t(`animals:purpose.${a.purpose}`)} />
              <Field label={t('animals:fields.notes')} value={a.notes ?? '-'} />
            </div>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Fotos del animal</h2>
            <PhotoUploader animalId={a.id} onUploaded={() => qc.invalidateQueries({ queryKey: ['animal-photos', a.id] })} />
            <PhotoGallery animalId={a.id} />
          </section>
        </Tabs.Content>

        <Tabs.Content value="historia" className="space-y-6">
          <Section title="Salud"><AnimalHealthTab /></Section>
          <Section title="Reproducción"><AnimalReproductionTab /></Section>
          <Section title="Producción"><AnimalProductionTab /></Section>
        </Tabs.Content>

        <Tabs.Content value="dinero" className="space-y-6">
          <Section title="Dinero del animal"><AnimalFinanceTab /></Section>
          <Section title="Comparación mes a mes"><ComparisonChart animalId={a.id} /></Section>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function TabHead({ value, icon: Icon, label }: { value: string; icon: LucideIcon; label: string }) {
  return (
    <Tabs.Trigger
      value={value}
      className="flex items-center justify-center gap-2 px-4 py-3 text-sm hover:bg-accent data-[state=active]:bg-accent data-[state=active]:font-semibold transition-colors"
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </Tabs.Trigger>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border p-4 space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Badge({ tone, icon: Icon, label }: { tone: 'amber' | 'green' | 'pink' | 'blue'; icon: LucideIcon; label: string }) {
  const tones: Record<string, string> = {
    amber: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
    green: 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200',
    pink:  'bg-pink-100 text-pink-900 dark:bg-pink-900/40 dark:text-pink-200',
    blue:  'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${tones[tone]}`}>
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 px-4 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
