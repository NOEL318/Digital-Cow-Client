import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Syringe, Stethoscope, Pill, Bug, UserCheck, ClipboardList, ChevronRight } from 'lucide-react';
import HealthOverviewPage from './HealthOverviewPage';
import { IconCard } from '@/components/ui/icon-card';

const sections = [
  { to: '/panel/salud/vacunaciones', icon: Syringe, title: 'Vacunaciones', description: 'Ver todas las vacunas aplicadas y programadas.' },
  { to: '/panel/salud/diagnosticos', icon: Stethoscope, title: 'Diagnosticos', description: 'Enfermedades detectadas en el rancho.' },
  { to: '/panel/salud/tratamientos', icon: Pill, title: 'Tratamientos', description: 'Medicinas aplicadas y en curso.' },
  { to: '/panel/salud/plagas', icon: Bug, title: 'Control de plagas', description: 'Aplicaciones para garrapatas, moscas y mas.' },
  { to: '/panel/salud/visitas-vet', icon: UserCheck, title: 'Visitas del veterinario', description: 'Historial de visitas y notas.' },
  { to: '/panel/salud/planes', icon: ClipboardList, title: 'Planes sanitarios', description: 'Calendarios de vacunacion por lote.' }
] as const;

/**
 * Panel unificado de Salud. Muestra primero las alertas y KPIs y debajo
 * tarjetas grandes para profundizar en cada categoria.
 */
export default function HealthPanelPage() {
  const { t } = useTranslation('common');
  return (
    <div className="space-y-6">
      <HealthOverviewPage />
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{t('nav.panelSalud')} en detalle</h2>
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
