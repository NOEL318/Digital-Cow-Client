/**
 * Registro del Service Worker generado por vite-plugin-pwa.
 *
 * - En DEV (`npm run dev`): NO se registra y se desregistra cualquier
 *   SW que haya quedado de una build/preview anterior, ademas de
 *   borrar los caches de Workbox. Sin esto, una visita previa a
 *   `npm run preview` deja al SW interceptando peticiones para
 *   siempre, lo que rompe el hot reload y el login.
 * - En PROD: registra el SW con autoUpdate.
 */
export function setupOffline() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  if (import.meta.env.DEV) {
    void unregisterAllAndClearCaches();
    return;
  }

  void registerProdSW();
}

async function unregisterAllAndClearCaches() {
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => r.unregister()));
  } catch { /* ignore */ }
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch { /* ignore */ }
}

async function registerProdSW() {
  // Import dinamico: el modulo virtual solo existe en build de produccion.
  const { registerSW } = await import('virtual:pwa-register');
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info('[Digital Cow] Ya puedes usar la app sin internet.');
    },
    onRegisteredSW(_swUrl, reg) {
      if (!reg) return;
      setInterval(() => reg.update().catch(() => { /* ignore */ }), 60 * 60 * 1000);
    }
  });
}
