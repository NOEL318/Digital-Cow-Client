/**
 * Este archivo contiene el indicador flotante que avisa cuando no hay conexion
 * o cuando hay operaciones pendientes en la cola offline.
 */
import { useEffect, useState } from 'react';
import { CloudOff, CloudUpload, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { subscribePending, flushQueue } from '@/lib/offline-queue';

/**
 * Indicador flotante: muestra si el navegador esta offline y/o si
 * hay operaciones pendientes en la cola para sincronizar. Permite
 * forzar el envio manualmente. Se oculta si todo esta al dia.
 */
export function OfflineIndicator() {
  const { t } = useTranslation('common');
  const [online, setOnline] = useState<boolean>(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [pending, setPending] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    const unsub = subscribePending(setPending);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
      unsub();
    };
  }, []);

  if (online && pending === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border bg-background shadow-lg px-3 py-2 text-sm print:hidden">
      {!online ? (
        <>
          <CloudOff className="h-4 w-4 text-amber-700" aria-hidden />
          <span>{t('offline.noConnection')}</span>
        </>
      ) : (
        <>
          <CloudUpload className="h-4 w-4 text-sky-700" aria-hidden />
          <span>{t('offline.pendingSync', { count: pending })}</span>
          <button
            type="button"
            onClick={async () => { setBusy(true); await flushQueue(); setBusy(false); }}
            disabled={busy}
            className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-accent"
            aria-label={t('offline.retrySync')}
          >
            <RefreshCcw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} aria-hidden />
          </button>
        </>
      )}
    </div>
  );
}
