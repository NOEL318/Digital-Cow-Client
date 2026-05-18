import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FeedingPlanEditor } from '@/features/feeding/plans/components/FeedingPlanEditor';
import { LotAssignmentDialog } from '@/features/feeding/plans/components/LotAssignmentDialog';

/** Pagina de detalle/editor de un plan de alimentacion. */
export default function FeedingPlanDetailPage() {
  const { id } = useParams();
  const planId = Number(id);
  const { t } = useTranslation(['feeding']);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <LotAssignmentDialog
          planId={planId}
          trigger={<Button>{t('feeding:plan.assign')}</Button>}
        />
      </div>
      <FeedingPlanEditor planId={planId} />
    </div>
  );
}
