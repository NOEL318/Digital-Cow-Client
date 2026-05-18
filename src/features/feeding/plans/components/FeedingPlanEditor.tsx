import { useTranslation } from 'react-i18next';
import { useFeedingPlan } from '../api';
import { FeedingPlanItemsList } from './FeedingPlanItemsList';

interface Props {
  planId: number;
}

/** Editor full-page de un plan de alimentacion: metadatos arriba y lista de insumos abajo. */
export function FeedingPlanEditor({ planId }: Props) {
  const { t } = useTranslation(['feeding', 'common']);
  const plan = useFeedingPlan(planId);
  if (plan.isLoading) return <p>{t('common:loading')}</p>;
  if (!plan.data) return null;
  const p = plan.data;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold">{p.name}</h2>
        {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
        <div className="text-sm">
          <span>{t('feeding:plan.category')}: {t(`feeding:plan.categoryValue.${p.category}`)}</span>
        </div>
      </header>
      <FeedingPlanItemsList planId={planId} items={p.items ?? []} />
    </div>
  );
}
