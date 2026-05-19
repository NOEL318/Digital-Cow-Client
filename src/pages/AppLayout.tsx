/**
 * Este archivo expone el layout autenticado de la aplicacion,
 * delegando la composicion visual en el componente AppShell.
 */
import { AppShell } from '@/components/app-shell';

/** Shell autenticado. Delega en AppShell desde Fase 6. */
export default function AppLayout() {
  return <AppShell />;
}
