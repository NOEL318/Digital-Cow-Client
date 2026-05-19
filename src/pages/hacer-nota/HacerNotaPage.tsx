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
  label: string;
  description: string;
}

const acciones: Tile[] = [
  { to: '/hacer-nota/vacune', icon: Syringe, label: 'Vacuné', description: 'Registrar una vacuna que aplicaste.' },
  { to: '/hacer-nota/pese', icon: Scale, label: 'Pesé', description: 'Anotar cuánto pesa un animal.' },
  { to: '/hacer-nota/ordene', icon: Milk, label: 'Ordeñé', description: 'Registrar el ordeño de una vaca.' },
  { to: '/hacer-nota/diagnostique', icon: Stethoscope, label: 'Diagnostiqué', description: 'Registrar una enfermedad o síntoma.' },
  { to: '/hacer-nota/trate', icon: Pill, label: 'Traté', description: 'Aplicar un tratamiento con medicamento.' },
  { to: '/hacer-nota/alimentar', icon: Wheat, label: 'Alimenté', description: 'Registrar comida dada a un lote.' },
  { to: '/hacer-nota/celo', icon: Heart, label: 'Vi un celo', description: 'Anotar la detección de un celo.' },
  { to: '/hacer-nota/servi', icon: Droplet, label: 'Inseminé / serví', description: 'Inseminación o monta.' },
  { to: '/hacer-nota/preñez', icon: Sparkles, label: 'Detecté preñez', description: 'Registrar un chequeo de preñez.' },
  { to: '/hacer-nota/parto', icon: Baby, label: 'Parió una vaca', description: 'Anotar un parto.' },
  { to: '/hacer-nota/seque', icon: MilkOff, label: 'Sequé', description: 'Marcar una vaca como seca.' },
  { to: '/hacer-nota/destete', icon: GraduationCap, label: 'Desteté', description: 'Registrar el destete de un becerro.' },
  { to: '/hacer-nota/aborto', icon: HeartCrack, label: 'Aborto', description: 'Anotar la pérdida de una gestación.' },
  { to: '/animales/nuevo', icon: ShoppingCart, label: 'Compré animal', description: 'Agregar un animal al rancho.' },
  { to: '/panel/dinero/ventas-animales', icon: Handshake, label: 'Vendí animal', description: 'Registrar la venta de un animal.' },
  { to: '/hacer-nota/gaste', icon: MinusCircle, label: 'Gasté', description: 'Anotar dinero que salió.' },
  { to: '/hacer-nota/recibi', icon: PlusCircle, label: 'Recibí dinero', description: 'Anotar dinero que entró.' }
];

const verSecciones: Tile[] = [
  { to: '/panel/salud', icon: HeartPulse, label: 'Salud', description: 'Vacunas, diagnósticos, tratamientos y alertas.' },
  { to: '/panel/alimentacion', icon: Wheat, label: 'Alimentación', description: 'Insumos, planes y consumo del rancho.' },
  { to: '/panel/dinero', icon: DollarSign, label: 'Dinero', description: 'Gastos, ingresos y resumen financiero.' },
  { to: '/panel/produccion', icon: Beef, label: 'Producción', description: 'Pesajes, ordeños y curvas de producción.' },
  { to: '/panel/reproduccion', icon: Baby, label: 'Reproducción', description: 'Celos, servicios, gestaciones y partos.' },
  { to: '/panel/reportes', icon: FileBarChart, label: 'Reportes', description: 'Inventario, históricos y resumen mensual.' }
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
          Elige qué quieres hacer. Te guiamos paso a paso.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Egg className="h-5 w-5 text-primary" aria-hidden />
          Registrar
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {acciones.map(a => <TileLink key={a.label} {...a} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" aria-hidden />
          Ver
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {verSecciones.map(s => <TileLink key={s.label} {...s} />)}
        </div>
      </section>
    </div>
  );
}

function TileLink({ to, icon: Icon, label, description }: Tile) {
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
