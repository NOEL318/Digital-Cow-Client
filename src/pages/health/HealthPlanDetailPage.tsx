/**
 * Esta pagina muestra el detalle de un plan sanitario con sus pasos y asignaciones.
 */
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { HealthPlanEditor } from '@/features/health/plans/components/HealthPlanEditor';
import { AssignPlanDialog } from '@/features/health/plans/components/AssignPlanDialog';

/**
 * Pagina de edicion de un plan sanitario y asignacion a animales/lotes.
 */
export default function HealthPlanDetailPage() {
  const { id } = useParams();
  const planId = Number(id);
  const { t } = useTranslation(['health']);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <AssignPlanDialog
          planId={planId}
          trigger={<Button>{t('health:plan.assign')}</Button>}
        />
      </div>
      <HealthPlanEditor planId={planId} />
    </div>
  );
}
