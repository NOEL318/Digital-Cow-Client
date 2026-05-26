import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface LightboxPhoto {
  id: number | string;
  url: string;
  alt?: string;
}

interface PhotoLightboxProps {
  /** Lista de fotos a navegar. */
  photos: LightboxPhoto[];
  /** Indice de la foto que se muestra al abrir. */
  initialIndex: number;
  /** Visible. */
  open: boolean;
  /** Callback de cierre. */
  onClose: () => void;
}

/**
 * Visor en pantalla completa para fotos. Soporta navegacion con
 * flechas del teclado (izquierda y derecha), ESC para cerrar y
 * boton de descarga en la esquina. Para movil hay tap zones a
 * los lados que avanzan o retroceden.
 */
export function PhotoLightbox({ photos, initialIndex, open, onClose }: PhotoLightboxProps) {
  const { t } = useTranslation('common');
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(Math.max(0, Math.min(initialIndex, photos.length - 1)));
  }, [open, initialIndex, photos.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIndex(i => Math.min(photos.length - 1, i + 1));
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, photos.length]);

  if (!open || photos.length === 0) return null;
  const current = photos[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('lightbox.ariaLabel')}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('lightbox.close')}
        className="absolute top-3 right-3 z-10 h-12 w-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
      >
        <X className="h-6 w-6" aria-hidden />
      </button>

      <a
        href={current.url}
        download
        target="_blank"
        rel="noreferrer"
        onClick={e => e.stopPropagation()}
        aria-label={t('lightbox.download')}
        className="absolute top-3 left-3 z-10 h-12 w-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
      >
        <Download className="h-6 w-6" aria-hidden />
      </a>

      {photos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setIndex(i => Math.max(0, i - 1)); }}
            aria-label={t('lightbox.prev')}
            disabled={index === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft className="h-8 w-8" aria-hidden />
          </button>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setIndex(i => Math.min(photos.length - 1, i + 1)); }}
            aria-label={t('lightbox.next')}
            disabled={index === photos.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight className="h-8 w-8" aria-hidden />
          </button>
        </>
      ) : null}

      <img
        src={current.url}
        alt={current.alt ?? t('lightbox.photoAlt', { n: index + 1 })}
        onClick={e => e.stopPropagation()}
        className="max-w-[95vw] max-h-[90vh] object-contain cursor-zoom-out"
      />

      {photos.length > 1 ? (
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 rounded-full px-3 py-1">
          {index + 1} / {photos.length}
        </span>
      ) : null}
    </div>
  );
}
