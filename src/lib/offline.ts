import { registerSW } from 'virtual:pwa-register';

/**
 * Registro del Service Worker generado por vite-plugin-pwa.
 * - autoUpdate: cuando hay una nueva versión, recarga sola la próxima
 *   vez que el usuario abra la app.
 * - onOfflineReady: muestra un mensaje cuando la app ya está lista
 *   para usarse sin internet.
 */
export function setupOffline() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info('[Digital Cow] Ya puedes usar la app sin internet.');
    },
    onRegisteredSW(_swUrl, reg) {
      if (!reg) return;
      // Revisar cada hora si hay versión nueva sin esperar a recargar manualmente.
      setInterval(() => reg.update().catch(() => { /* ignore */ }), 60 * 60 * 1000);
    }
  });
}
