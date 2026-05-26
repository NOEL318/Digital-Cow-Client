/**
 * Esta pagina es el punto unico para registrar eventos del rancho via wizards cortos.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Syringe, Stethoscope, Pill, Scale, Milk, MilkOff, Wheat,
  ShoppingCart, Handshake, MinusCircle, PlusCircle, Heart, Sparkles,
  HeartPulse, DollarSign, Beef, Baby, Egg, FileBarChart,
  Droplet, GraduationCap, HeartCrack
} from 'lucide-react';

interface Tile {
  to: string;
  icon: typeof Syringe;
  /** id de traduccion bajo hacerNota.act.* o hacerNota.sec.* */
  id: string;
}

const acciones: Tile[] = [
  { to: '/hacer-nota/vacune', icon: Syringe, id: 'vacune' },
  { to: '/hacer-nota/pese', icon: Scale, id: 'pese' },
  { to: '/hacer-nota/ordene', icon: Milk, id: 'ordene' },
  { to: '/hacer-nota/diagnostique', icon: Stethoscope, id: 'diagnostique' },
  { to: '/hacer-nota/trate', icon: Pill, id: 'trate' },
  { to: '/hacer-nota/alimentar', icon: Wheat, id: 'alimentar' },
  { to: '/hacer-nota/celo', icon: Heart, id: 'celo' },
  { to: '/hacer-nota/servi', icon: Droplet, id: 'servi' },
  { to: '/hacer-nota/preñez', icon: Sparkles, id: 'prenez' },
  { to: '/hacer-nota/parto', icon: Baby, id: 'parto' },
  { to: '/hacer-nota/seque', icon: MilkOff, id: 'seque' },
  { to: '/hacer-nota/destete', icon: GraduationCap, id: 'destete' },
  { to: '/hacer-nota/aborto', icon: HeartCrack, id: 'aborto' },
  { to: '/animales/nuevo', icon: ShoppingCart, id: 'compre' },
  { to: '/panel/dinero/ventas-animales', icon: Handshake, id: 'vendi' },
  { to: '/hacer-nota/gaste', icon: MinusCircle, id: 'gaste' },
  { to: '/hacer-nota/recibi', icon: PlusCircle, id: 'recibi' }
];

const verSecciones: Tile[] = [
  { to: '/panel/salud', icon: HeartPulse, id: 'salud' },
  { to: '/panel/alimentacion', icon: Wheat, id: 'alimentacion' },
  { to: '/panel/dinero', icon: DollarSign, id: 'dinero' },
  { to: '/panel/produccion', icon: Beef, id: 'produccion' },
  { to: '/panel/reproduccion', icon: Baby, id: 'reproduccion' },
  { to: '/panel/reportes', icon: FileBarChart, id: 'reportes' }
];

/**
 * Pantalla principal de trabajo. Combina lo que antes eran dos
 * pantallas (Hacer una nota y Panel) en una sola, con dos secciones
 * claras: "Registrar" (acciones que el usuario hace) y "Ver"
 * (paneles de informacion). Todas las tarjetas comparten el mismo
 * estilo grande con icono y descripcion corta.
 */
export default function HacerNotaPage() {
  const { t } = useTranslation('common');
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t('nav.hacerNota')}</h1>
        <p className="text-muted-foreground">
          {t('hacerNota.subtitle')}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Egg className="h-5 w-5 text-primary" aria-hidden />
          {t('hacerNota.registrar')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {acciones.map(a => (
            <TileLink key={a.to} to={a.to} icon={a.icon}
              label={t(`hacerNota.act.${a.id}.label`)} description={t(`hacerNota.act.${a.id}.desc`)} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" aria-hidden />
          {t('hacerNota.ver')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {verSecciones.map(s => (
            <TileLink key={s.to} to={s.to} icon={s.icon}
              label={t(`hacerNota.sec.${s.id}.label`)} description={t(`hacerNota.sec.${s.id}.desc`)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TileLink({ to, icon: Icon, label, description }: { to: string; icon: typeof Syringe; label: string; description: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-background p-5 hover:bg-accent hover:border-primary/40 transition-colors min-h-36 text-center"
    >
      <Icon className="h-10 w-10 text-primary" aria-hidden />
      <span className="text-base font-semibold leading-tight">{label}</span>
      <span className="text-xs text-muted-foreground leading-snug">{description}</span>
    </Link>
  );
}
