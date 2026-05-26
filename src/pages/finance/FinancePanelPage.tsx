/**
 * Esta pagina agrupa las pestanas del panel financiero: gastos, ingresos, ventas y categorias.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MinusCircle, PlusCircle, Handshake, Milk, ChevronRight } from 'lucide-react';
import { IconCard } from '@/components/ui/icon-card';
import FinanceOverviewPage from './FinanceOverviewPage';

/**
 * Panel unificado de Dinero. Muestra primero el resumen de KPIs y graficas y luego
 * un conjunto de tarjetas grandes que llevan a las pantallas internas de cada
 * tipo de movimiento. Todos los textos pasan por i18next para soportar espanol e ingles.
 */
export default function FinancePanelPage() {
  const { t } = useTranslation(['finance', 'common']);
  const sections = [
    { to: '/panel/dinero/gastos', icon: MinusCircle, title: t('finance:panel.expenses.title'), description: t('finance:panel.expenses.desc') },
    { to: '/panel/dinero/ingresos', icon: PlusCircle, title: t('finance:panel.incomes.title'), description: t('finance:panel.incomes.desc') },
    { to: '/panel/dinero/ventas-animales', icon: Handshake, title: t('finance:panel.animalSales.title'), description: t('finance:panel.animalSales.desc') },
    { to: '/panel/dinero/ventas-leche', icon: Milk, title: t('finance:panel.milkSales.title'), description: t('finance:panel.milkSales.desc') }
  ];

  return (
    <div className="space-y-6">
      <FinanceOverviewPage />
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t('common:labels.moneyDetail')}</h2>
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
                  {t('common:actions.viewAll')}
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
