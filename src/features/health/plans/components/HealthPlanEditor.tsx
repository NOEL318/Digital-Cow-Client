/**
 * Este componente es el editor visual del modulo health/plans para construir o ajustar un recurso complejo.
 */
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { useHealthPlan } from '../api';
import { HealthPlanStepsList } from './HealthPlanStepsList';

interface Props {
  planId: number;
}

/**
 * Editor de un plan sanitario: metadatos arriba y lista de steps abajo.
 * Si el plan es global (accountId null), entra en modo solo lectura.
 */
export function HealthPlanEditor({ planId }: Props) {
  const { t } = useTranslation(['health', 'common']);
  const plan = useHealthPlan(planId);
  if (plan.isLoading) return <p>{t('common:loading')}</p>;
  if (!plan.data) return null;
  const p = plan.data;
  const isGlobal = p.accountId === null;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {p.name}
          {isGlobal && <Lock className="h-4 w-4 text-muted-foreground" aria-label={t('health:plan.global')} />}
        </h2>
        {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
        <div className="text-sm">
          <span className="mr-4">{t('health:plan.appliesToPurpose')}: {p.appliesToPurpose}</span>
          <span>{t('health:plan.appliesToSex')}: {p.appliesToSex}</span>
        </div>
      </header>
      <HealthPlanStepsList planId={planId} steps={p.steps ?? []} readOnly={isGlobal} />
    </div>
  );
}
