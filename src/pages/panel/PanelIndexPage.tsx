/**
 * Esta pagina es el indice del menu de paneles operativos del rancho.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Wheat, DollarSign, Heart, Scale, FileText } from 'lucide-react';

const tiles = [
  { to: '/panel/salud', icon: Activity, key: 'nav.panelSalud' },
  { to: '/panel/alimentacion', icon: Wheat, key: 'nav.panelAlimentacion' },
  { to: '/panel/dinero', icon: DollarSign, key: 'nav.panelDinero' },
  { to: '/panel/reproduccion', icon: Heart, key: 'nav.panelReproduccion' },
  { to: '/panel/produccion', icon: Scale, key: 'nav.panelProduccion' },
  { to: '/panel/reportes', icon: FileText, key: 'nav.panelReportes' }
] as const;

/**
 * Hub del Panel. Tarjetas grandes a las sub-paginas existentes.
 * Stub Fase 6.1: las sub-paginas son los paneles actuales sin rediseno.
 */
export default function PanelIndexPage() {
  const { t } = useTranslation('common');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('nav.panel')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map(tile => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.to}
              to={tile.to}
              className="flex items-center gap-4 rounded-xl border p-5 hover:bg-accent transition-colors min-h-24"
            >
              <Icon className="h-10 w-10 text-primary" aria-hidden />
              <span className="text-lg font-semibold">{t(tile.key)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
