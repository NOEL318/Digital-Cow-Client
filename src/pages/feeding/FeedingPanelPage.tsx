import { Link } from 'react-router-dom';
import { Package, ClipboardList, Wheat, Calculator, ChevronRight } from 'lucide-react';
import { IconCard } from '@/components/ui/icon-card';
import FeedingCostSummaryPage from './FeedingCostSummaryPage';

const sections = [
  { to: '/panel/alimentacion/items', icon: Package, title: 'Alimentos', description: 'Cosas que les das de comer y su precio por kilogramo.' },
  { to: '/panel/alimentacion/planes', icon: ClipboardList, title: 'Planes de alimentacion', description: 'Que come cada lote y cuanto.' },
  { to: '/panel/alimentacion/registros', icon: Wheat, title: 'Registros del dia', description: 'Lo que se les dio cada dia.' },
  { to: '/panel/alimentacion/costo', icon: Calculator, title: 'Resumen de costo', description: 'Cuanto cuesta alimentar tu rancho.' }
] as const;

/**
 * Panel unificado de Alimentacion. Resumen de costo arriba; tarjetas
 * grandes para entrar a cada subseccion.
 */
export default function FeedingPanelPage() {
  return (
    <div className="space-y-6">
      <FeedingCostSummaryPage />
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Alimentacion en detalle</h2>
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
