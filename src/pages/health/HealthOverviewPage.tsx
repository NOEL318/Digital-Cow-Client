/**
 * Esta pagina muestra el resumen del estado sanitario del rancho con alertas y kpis.
 */
import { useTranslation } from 'react-i18next';
import { useHealthAlerts } from '@/features/health/alerts/api';
import { AlertsList } from '@/features/health/alerts/components/AlertsList';

/**
 * Landing de Salud: muestra todas las alertas agrupadas por bucket.
 */
export default function HealthOverviewPage() {
  const { t } = useTranslation(['health', 'alerts', 'common']);
  const alerts = useHealthAlerts();
  const d = alerts.data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('alerts:title')}</h1>
      {alerts.isLoading ? (
        <p>{t('common:loading')}</p>
      ) : (
        d && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AlertsList
              title={t('alerts:upcoming7d')}
              items={d.upcomingVaccinations7d}
              emptyKey="alerts:noAlerts"
            />
            <AlertsList
              title={t('alerts:upcoming30d')}
              items={d.upcomingVaccinations30d}
              emptyKey="alerts:noAlerts"
            />
            <AlertsList
              title={t('alerts:withdrawalMilk')}
              items={d.withdrawalActiveMilk}
              emptyKey="alerts:noAlerts"
            />
            <AlertsList
              title={t('alerts:withdrawalMeat')}
              items={d.withdrawalActiveMeat}
              emptyKey="alerts:noAlerts"
            />
            <AlertsList
              title={t('alerts:diagnosesNoTreatment')}
              items={d.activeDiagnosesWithoutTreatment}
              emptyKey="alerts:noAlerts"
            />
          </div>
        )
      )}
    </div>
  );
}
