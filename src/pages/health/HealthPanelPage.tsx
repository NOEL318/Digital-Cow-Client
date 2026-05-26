/**
 * Esta pagina agrupa las pestanas del panel de salud: vacunaciones, diagnosticos, tratamientos y mas.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Syringe, Stethoscope, Pill, Bug, UserCheck, ClipboardList, ChevronRight } from 'lucide-react';
import HealthOverviewPage from './HealthOverviewPage';
import { IconCard } from '@/components/ui/icon-card';

/**
 * Panel unificado de Salud. Muestra primero las alertas y KPIs y debajo
 * tarjetas grandes para profundizar en cada categoria.
 */
export default function HealthPanelPage() {
  const { t } = useTranslation(['health', 'common']);

  const sections = [
    {
      to: '/panel/salud/vacunaciones',
      icon: Syringe,
      title: t('health:nav.vaccinations'),
      description: t('health:panel.vaccinationsDesc')
    },
    {
      to: '/panel/salud/diagnosticos',
      icon: Stethoscope,
      title: t('health:nav.diagnoses'),
      description: t('health:panel.diagnosesDesc')
    },
    {
      to: '/panel/salud/tratamientos',
      icon: Pill,
      title: t('health:nav.treatments'),
      description: t('health:panel.treatmentsDesc')
    },
    {
      to: '/panel/salud/plagas',
      icon: Bug,
      title: t('health:nav.pestControls'),
      description: t('health:panel.pestControlsDesc')
    },
    {
      to: '/panel/salud/visitas-vet',
      icon: UserCheck,
      title: t('health:nav.vetVisits'),
      description: t('health:panel.vetVisitsDesc')
    },
    {
      to: '/panel/salud/planes',
      icon: ClipboardList,
      title: t('health:nav.plans'),
      description: t('health:panel.plansDesc')
    }
  ] as const;

  return (
    <div className="space-y-6">
      <HealthOverviewPage />
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t('health:panel.detailHeading')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map(s => (
            <Link key={s.to} to={s.to} className="block">
              <IconCard
                icon={s.icon}
                title={s.title}
                description={s.description}
                size="md"
              >
                <span className="inline-flex items-center text-xs text-primary mt-1">
                  {t('health:panel.viewAll')} <ChevronRight className="h-3 w-3" aria-hidden />
                </span>
              </IconCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
