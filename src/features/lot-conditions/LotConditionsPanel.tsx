/**
 * Este componente muestra el panel de condiciones del lote con indicadores ambientales y de manejo.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Cloud, CloudRain, Sun, Droplet, Bug,
  Wheat, Wrench, Plus, X, type LucideIcon
} from 'lucide-react';
import {
  useLotConditions, useCreateLotCondition, useDeleteLotCondition,
  type LotCondition, type LotConditionKind
} from './api';
import { BigButton } from '@/components/ui/big-button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHelp } from '@/components/ui/page-help';

interface PresetEntry {
  kind: LotConditionKind;
  icon: LucideIcon;
  color: string;
}

const PRESET: PresetEntry[] = [
  { kind: 'MUD_HIGH',    icon: Droplet,   color: 'text-amber-800' },
  { kind: 'MUD_MEDIUM',  icon: Droplet,   color: 'text-amber-600' },
  { kind: 'MUD_LOW',     icon: Droplet,   color: 'text-amber-400' },
  { kind: 'RAIN_HEAVY',  icon: CloudRain, color: 'text-sky-700' },
  { kind: 'RAIN_LIGHT',  icon: Cloud,     color: 'text-sky-500' },
  { kind: 'DROUGHT',     icon: Sun,       color: 'text-orange-600' },
  { kind: 'HEAT_WAVE',   icon: Sun,       color: 'text-red-600' },
  { kind: 'COLD',        icon: Cloud,     color: 'text-blue-600' },
  { kind: 'FLIES',       icon: Bug,       color: 'text-yellow-700' },
  { kind: 'TICKS',       icon: Bug,       color: 'text-red-700' },
  { kind: 'OTHER_PEST',  icon: Bug,       color: 'text-purple-700' },
  { kind: 'WATER_OUT',   icon: Droplet,   color: 'text-red-700' },
  { kind: 'WATER_LOW',   icon: Droplet,   color: 'text-orange-500' },
  { kind: 'PASTURE_LOW', icon: Wheat,     color: 'text-amber-700' },
  { kind: 'PASTURE_GOOD',icon: Wheat,     color: 'text-green-700' },
  { kind: 'INFRA_DAMAGE',icon: Wrench,    color: 'text-orange-700' }
];

const KIND_META: Partial<Record<LotConditionKind, { icon: LucideIcon; color: string }>> =
  Object.fromEntries(PRESET.map(p => [p.kind, { icon: p.icon, color: p.color }]));

interface LotConditionsPanelProps {
  lotId: number;
}

/**
 * Panel rapido para registrar condiciones del corral. El usuario toca
 * un boton predefinido y se guarda al instante con la fecha de hoy.
 * Tambien permite agregar una etiqueta personalizada (CUSTOM) cuando
 * lo predefinido no aplica.
 */
export function LotConditionsPanel({ lotId }: LotConditionsPanelProps) {
  const { t } = useTranslation('feeding');
  const conditions = useLotConditions(lotId);
  const create = useCreateLotCondition(lotId);
  const del = useDeleteLotCondition(lotId);
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  function logPreset(kind: LotConditionKind) {
    create.mutate({
      lotId,
      observedAt: new Date().toISOString().slice(0, 10),
      kind
    });
  }

  function logCustom() {
    const text = customText.trim();
    if (!text) return;
    create.mutate({
      lotId,
      observedAt: new Date().toISOString().slice(0, 10),
      kind: 'CUSTOM',
      customLabel: text
    });
    setCustomText('');
    setCustomOpen(false);
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold">{t('lotConditions.title')}</h2>
        <BigButton
          label={t('lotConditions.addOther')}
          icon={Plus}
          variant="outline"
          onClick={() => setCustomOpen(o => !o)}
        />
      </header>

      <p className="text-sm text-muted-foreground">
        {t('lotConditions.hint')}
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
        {PRESET.map(p => {
          const Icon = p.icon;
          const label = t(`lotConditions.preset.${p.kind}`);
          return (
            <button
              key={p.kind}
              type="button"
              onClick={() => logPreset(p.kind)}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border p-3 hover:bg-accent transition-colors min-h-20 text-center"
            >
              <Icon className={`h-6 w-6 ${p.color}`} aria-hidden />
              <span className="text-xs font-semibold leading-tight">{label}</span>
            </button>
          );
        })}
      </div>

      {customOpen ? (
        <div className="flex gap-2">
          <input
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder={t('lotConditions.customPlaceholder')}
            className="flex-1 border rounded-md px-3 py-2 text-base bg-background"
            autoFocus
          />
          <BigButton
            label={t('lotConditions.save')}
            onClick={logCustom}
            disabled={!customText.trim() || create.isPending}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {t('lotConditions.recentHistory')}
        </h3>
        {conditions.isLoading ? (
          <p className="text-muted-foreground">{t('lotConditions.loading')}</p>
        ) : !conditions.data || conditions.data.length === 0 ? (
          <EmptyState
            icon={Cloud}
            title={t('lotConditions.emptyTitle')}
            description={t('lotConditions.emptyDesc')}
          />
        ) : (
          <ul className="divide-y border rounded-xl overflow-hidden">
            {conditions.data.map(c => (
              <ConditionRow
                key={c.id}
                condition={c}
                onDelete={id => del.mutate(id)}
                getLabel={(kind, customLabel) =>
                  kind === 'CUSTOM'
                    ? (customLabel ?? t('lotConditions.customFallback'))
                    : t(`lotConditions.preset.${kind}`)
                }
                deleteAriaLabel={t('lotConditions.deleteAria')}
              />
            ))}
          </ul>
        )}
      </div>

      <PageHelp text={t('lotConditions.helpText')} />
    </section>
  );
}

interface ConditionRowProps {
  condition: LotCondition;
  onDelete: (id: number) => void;
  getLabel: (kind: LotConditionKind, customLabel?: string | null) => string;
  deleteAriaLabel: string;
}

function ConditionRow({ condition, onDelete, getLabel, deleteAriaLabel }: ConditionRowProps) {
  const meta = KIND_META[condition.kind];
  const Icon = meta?.icon ?? Cloud;
  const label = getLabel(condition.kind, condition.customLabel);
  return (
    <li className="flex items-center gap-3 px-3 py-2">
      <Icon className={`h-5 w-5 ${meta?.color ?? 'text-muted-foreground'}`} aria-hidden />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        <p className="text-xs text-muted-foreground">{condition.observedAt}</p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(condition.id)}
        aria-label={deleteAriaLabel}
        className="p-1 rounded hover:bg-accent"
      >
        <X className="h-4 w-4 text-muted-foreground" aria-hidden />
      </button>
    </li>
  );
}
