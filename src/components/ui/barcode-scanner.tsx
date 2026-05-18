import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import { ScanLine, X, AlertTriangle } from 'lucide-react';
import { BigButton } from './big-button';
import { cn } from '@/lib/utils';

interface BarcodeScannerProps {
  /** Visible cuando es true; cierra cuando es false. */
  open: boolean;
  /** Callback al cerrar (sin escaneo o tras escaneo exitoso). */
  onClose: () => void;
  /** Callback cuando se detecta un codigo. El componente NO cierra solo. */
  onDetected: (code: string) => void;
  /** Titulo del modal. */
  title?: string;
}

/**
 * Modal que abre la camara del dispositivo y emite el codigo de
 * barras detectado. Cae a un input manual si la camara no esta
 * disponible o el usuario niega permisos. No persiste estado entre
 * aperturas; cada apertura inicializa el reader fresco.
 */
export function BarcodeScanner({ open, onClose, onDetected, title }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);
    setManualCode('');
    const reader = new BrowserMultiFormatReader();

    (async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (devices.length === 0) {
          setError('No encontramos una camara en este dispositivo. Puedes escribir el codigo a mano.');
          return;
        }
        const preferred =
          devices.find(d => /back|trás|trasera|rear|environment/i.test(d.label)) ?? devices[0];
        if (cancelled || !videoRef.current) return;
        const controls = await reader.decodeFromVideoDevice(
          preferred.deviceId,
          videoRef.current,
          (result, _err, ctrl) => {
            if (cancelled) {
              ctrl.stop();
              return;
            }
            if (result) {
              onDetected(result.getText());
              ctrl.stop();
            }
          }
        );
        controlsRef.current = controls;
      } catch (e) {
        const msg = (e as Error)?.message ?? '';
        if (/Permission/i.test(msg) || /denied/i.test(msg)) {
          setError('No nos diste permiso para usar la camara. Puedes escribir el codigo a mano.');
        } else {
          setError('No pudimos abrir la camara. Puedes escribir el codigo a mano.');
        }
      }
    })();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, onDetected]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Escanear codigo de barras'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    >
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-md p-4 space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ScanLine className="h-5 w-5" aria-hidden />
            {title ?? 'Escanear codigo de barras'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-full hover:bg-accent"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        {error ? (
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3 text-sm flex gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-700" aria-hidden />
            <span>{error}</span>
          </div>
        ) : (
          <div className={cn('relative rounded-lg overflow-hidden bg-black aspect-[3/2]')}>
            <video ref={videoRef} className="w-full h-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-primary rounded-lg w-3/4 h-1/3" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="manual-barcode" className="text-sm font-semibold">
            Escribir codigo a mano
          </label>
          <div className="flex gap-2">
            <input
              id="manual-barcode"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              placeholder="Ejemplo: 7501234567890"
              className="flex-1 border rounded-md px-3 py-2 text-base bg-background"
            />
            <BigButton
              label="Usar"
              onClick={() => {
                const code = manualCode.trim();
                if (code) onDetected(code);
              }}
              disabled={!manualCode.trim()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
