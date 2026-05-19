/**
 * Este archivo define el shell de la aplicacion autenticada,
 * con header superior, sidebar lateral en escritorio y nav inferior en movil.
 */
import { Outlet } from 'react-router-dom';
import { UserMenu } from './user-menu';
import { BottomNav } from './bottom-nav';
import { DesktopSidebar } from './desktop-sidebar';
import { OfflineIndicator } from './offline-indicator';

/**
 * Shell autenticado: header arriba, sidebar lateral en escritorio,
 * bottom nav en movil. El main reserva padding inferior en movil
 * para no quedar oculto por la nav, y un desplazamiento lateral en
 * escritorio para hacer espacio a la sidebar.
 *
 * Incluye OfflineIndicator que aparece cuando no hay conexion o
 * cuando hay requests pendientes en la cola offline.
 */
export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b flex items-center justify-between px-4 py-2 print:hidden md:ml-60">
        <div className="font-bold md:hidden">Digital Cow</div>
        <div className="hidden md:block" />
        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </header>
      <DesktopSidebar />
      <main className="flex-1 p-4 overflow-auto pb-24 md:pb-4 md:ml-60 print:p-0 print:ml-0">
        <Outlet />
      </main>
      <BottomNav />
      <OfflineIndicator />
    </div>
  );
}
