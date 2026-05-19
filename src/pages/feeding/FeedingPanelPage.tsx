/**
 * Esta pagina agrupa las pestanas del panel de alimentacion: items, planes, registros y costos.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, ClipboardList, Wheat, Calculator, ChevronRight } from 'lucide-react';
import { IconCard } from '@/components/ui/icon-card';
import FeedingCostSummaryPage from './FeedingCostSummaryPage';

/**
 * Panel unificado de Alimentacion. Resumen de costo arriba; tarjetas
 * grandes para entrar a cada subseccion.
 */
export default function FeedingPanelPage() {
  const { t } = useTranslation(['feeding', 'common']);
  const sections = [
    { to: '/panel/alimentacion/items', icon: Package, title: t('feeding:panel.items.title', { defaultValue: 'Alimentos' }), description: t('feeding:panel.items.desc', { defaultValue: 'Cosas que les das de comer y su precio por kilogramo.' }) },
    { to: '/panel/alimentacion/planes', icon: ClipboardList, title: t('feeding:panel.plans.title', { defaultValue: 'Planes de alimentacion' }), description: t('feeding:panel.plans.desc', { defaultValue: 'Que come cada lote y cuanto.' }) },
    { to: '/panel/alimentacion/registros', icon: Wheat, title: t('feeding:panel.records.title', { defaultValue: 'Registros del dia' }), description: t('feeding:panel.records.desc', { defaultValue: 'Lo que se les dio cada dia.' }) },
    { to: '/panel/alimentacion/costo', icon: Calculator, title: t('feeding:panel.cost.title', { defaultValue: 'Resumen de costo' }), description: t('feeding:panel.cost.desc', { defaultValue: 'Cuanto cuesta alimentar tu rancho.' }) }
  ];

  return (
    <div className="space-y-6">
      <FeedingCostSummaryPage />
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t('common:labels.feedingDetail')}</h2>
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
                  {t('common:actions.viewAll', { defaultValue: 'Ver todo' })}
                  <ChevronRight className="h-3 w-3" aria-hidden />
                </span>
              </IconCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
