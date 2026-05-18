import { Link } from 'react-router-dom';
import { MinusCircle, PlusCircle, Handshake, Milk, ChevronRight } from 'lucide-react';
import { IconCard } from '@/components/ui/icon-card';
import FinanceOverviewPage from './FinanceOverviewPage';

const sections = [
  { to: '/panel/dinero/gastos', icon: MinusCircle, title: 'Gastos', description: 'Lo que pagaste por insumos, servicios y mas.' },
  { to: '/panel/dinero/ingresos', icon: PlusCircle, title: 'Ingresos', description: 'El dinero que recibiste.' },
  { to: '/panel/dinero/ventas-animales', icon: Handshake, title: 'Ventas de animales', description: 'Animales que vendiste y a quien.' },
  { to: '/panel/dinero/ventas-leche', icon: Milk, title: 'Ventas de leche', description: 'Leche entregada al comprador y su precio.' }
] as const;

/**
 * Panel unificado de Dinero. Resumen de KPIs y graficas arriba; tarjetas
 * grandes para entrar a cada tipo de movimiento.
 */
export default function FinancePanelPage() {
  return (
    <div className="space-y-6">
      <FinanceOverviewPage />
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Dinero en detalle</h2>
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
                  Ver todo <ChevronRight className="h-3 w-3" aria-hidden />
                </span>
              </IconCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
