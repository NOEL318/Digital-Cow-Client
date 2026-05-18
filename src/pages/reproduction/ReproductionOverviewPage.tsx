import { useTranslation } from 'react-i18next';
import { useReproductionAlerts } from '@/features/reproduction/alerts/api';
import { ReproductionAlertsList } from '@/features/reproduction/alerts/components/ReproductionAlertsList';

/** Landing de Reproduccion: muestra todas las alertas agrupadas por bucket. */
export default function ReproductionOverviewPage() {
  const { t } = useTranslation(['reproductionAlerts', 'common']);
  const alerts = useReproductionAlerts();
  const d = alerts.data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('reproductionAlerts:title')}</h1>
      {alerts.isLoading ? (
        <p>{t('common:loading')}</p>
      ) : (
        d && (
          <div className="grid gap-4 md:grid-cols-2">
            <ReproductionAlertsList
              title={t('reproductionAlerts:upcomingCalvings')}
              items={d.upcomingCalvings21d}
              emptyKey="reproductionAlerts:noAlerts"
            />
            <ReproductionAlertsList
              title={t('reproductionAlerts:dryOffDue')}
              items={d.dryOffDue}
              emptyKey="reproductionAlerts:noAlerts"
            />
            <ReproductionAlertsList
              title={t('reproductionAlerts:servedWithoutCheck')}
              items={d.servedWithoutCheck}
              emptyKey="reproductionAlerts:noAlerts"
            />
            <ReproductionAlertsList
              title={t('reproductionAlerts:openTooLong')}
              items={d.openTooLong}
              emptyKey="reproductionAlerts:noAlerts"
            />
          </div>
        )
      )}
    </div>
  );
}
