/**
 * Helpers para activar notificaciones push del navegador. El envio
 * efectivo requiere backend con claves VAPID y endpoint de envio;
 * por ahora solo registramos la suscripcion en el backend para que
 * el envio se implemente cuando se decida el proveedor (web-push
 * nativo, Firebase Cloud Messaging, etc.).
 */
import { http } from './http';

const VAPID_PUBLIC_KEY = (import.meta.env.VITE_VAPID_PUBLIC_KEY ?? '') as string;

export type PushPermission = 'granted' | 'denied' | 'default' | 'unsupported';

export function pushPermission(): PushPermission {
  if (typeof window === 'undefined') return 'unsupported';
  if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return 'unsupported';
  }
  return Notification.permission as PushPermission;
}

/**
 * Pide permiso y suscribe el navegador al endpoint de Push.
 * Si VAPID_PUBLIC_KEY no esta configurado solo pide permiso.
 * Devuelve true si la suscripcion quedo activa, false en caso contrario.
 */
export async function enablePush(): Promise<boolean> {
  if (pushPermission() === 'unsupported') return false;
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return false;
  if (!VAPID_PUBLIC_KEY) {
    // Sin VAPID: dejamos permiso concedido y permitimos notificaciones locales (page-level).
    return true;
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    const key = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      // Cast a BufferSource: el tipo Uint8Array de DOM lib espera ArrayBuffer no compartido.
      applicationServerKey: key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer
    });
    await http.post('/push/subscribe', sub.toJSON());
    return true;
  } catch (e) {
    return false;
  }
}

function urlBase64ToUint8Array(b64: string): Uint8Array {
  const padding = '='.repeat((4 - b64.length % 4) % 4);
  const base64 = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
  return out;
}

/**
 * Notificacion local del navegador (no requiere VAPID ni servidor).
 * Util como fallback inmediato cuando el push remoto no esta listo.
 */
export function notifyLocal(title: string, body: string): void {
  if (pushPermission() !== 'granted') return;
  try {
    new Notification(title, { body });
  } catch {
    // ignore
  }
}
