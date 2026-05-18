/**
 * Cola simple de operaciones pendientes para uso offline. Guarda en
 * localStorage los POST/PATCH/DELETE que el axios cliente intentó
 * ejecutar sin conexion. Cuando el navegador detecta "online" se
 * intenta reenviar uno por uno.
 *
 * Implementacion intencionalmente minimalista: localStorage es
 * suficiente para volumenes pequenos (<1 MB) y evita la complejidad
 * de IndexedDB. Para volumenes mayores migrar a IndexedDB usando
 * la API `idb-keyval`.
 */
import { http } from './http';

const STORAGE_KEY = 'digitalcow.offlineQueue.v1';

export interface QueuedRequest {
  id: string;
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  url: string;
  data?: unknown;
  queuedAt: string;
  attempts: number;
}

function readQueue(): QueuedRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function writeQueue(q: QueuedRequest[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(q));
}

export function enqueue(req: Omit<QueuedRequest, 'id' | 'queuedAt' | 'attempts'>): void {
  const queue = readQueue();
  queue.push({
    ...req,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    queuedAt: new Date().toISOString(),
    attempts: 0
  });
  writeQueue(queue);
  notifyListeners();
}

export function pendingCount(): number {
  return readQueue().length;
}

const listeners = new Set<(count: number) => void>();

export function subscribePending(cb: (count: number) => void): () => void {
  listeners.add(cb);
  cb(pendingCount());
  return () => listeners.delete(cb);
}

function notifyListeners(): void {
  const c = pendingCount();
  listeners.forEach(cb => cb(c));
}

/**
 * Intenta enviar los requests encolados uno por uno. Si alguno falla
 * por red lo deja en la cola; si falla por error 4xx lo descarta
 * para no quedar atorado para siempre.
 */
export async function flushQueue(): Promise<void> {
  let queue = readQueue();
  if (queue.length === 0) return;
  const remaining: QueuedRequest[] = [];
  for (const req of queue) {
    try {
      await http.request({ method: req.method, url: req.url, data: req.data });
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      const networkError = status == null;
      if (networkError && req.attempts < 5) {
        remaining.push({ ...req, attempts: req.attempts + 1 });
      } else if (!networkError && status != null && status >= 500 && req.attempts < 3) {
        remaining.push({ ...req, attempts: req.attempts + 1 });
      }
      // 4xx: descartamos para no quedar atorados.
    }
  }
  writeQueue(remaining);
  notifyListeners();
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { flushQueue(); });
  // Intento inicial al cargar la app.
  setTimeout(() => { if (navigator.onLine) flushQueue(); }, 2000);
}
