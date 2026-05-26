/**
 * Este componente es el bloque destacado de la cabecera del modulo animals.
 */
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Camera, Plus, ImageIcon } from 'lucide-react';
import { http } from '@/lib/http';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { PhotoLightbox } from '@/components/ui/photo-lightbox';
import { usePhotoUpload } from '@/features/animals/usePhotoUpload';

interface AnimalPhoto { id: number; url: string }

interface AnimalHeroProps {
  animalId: number;
  internalTag: string;
  name?: string | null;
  coverPhotoId?: number | null;
  /** URL ya conocida para evitar la consulta extra cuando el caller la tiene. */
  knownCoverUrl?: string | null;
}

/**
 * Foto principal del animal en grande (16:9) con fallback al
 * AnimalAvatar de iniciales. Clic en la foto abre el lightbox con
 * todas las fotos del animal. Boton flotante abajo a la derecha
 * para subir foto nueva (camara o galeria del telefono).
 */
export function AnimalHero({ animalId, internalTag, name, coverPhotoId, knownCoverUrl }: AnimalHeroProps) {
  const qc = useQueryClient();
  const { t } = useTranslation('animals');
  const photos = useQuery({
    queryKey: ['animal-photos', animalId],
    queryFn: () => http.get<AnimalPhoto[]>(`/animals/${animalId}/photos`).then(r => r.data)
  });
  const { state, openFilePicker } = usePhotoUpload(animalId, () => {
    qc.invalidateQueries({ queryKey: ['animal-photos', animalId] });
    qc.invalidateQueries({ queryKey: ['animal', animalId] });
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const data = photos.data ?? [];
  const coverIndex = data.findIndex(p => p.id === coverPhotoId);
  const heroIndex = coverIndex >= 0 ? coverIndex : 0;
  const heroUrl =
    knownCoverUrl
    ?? data[heroIndex]?.url
    ?? null;

  const lightboxPhotos = data.map(p => ({
    id: p.id,
    url: p.url,
    alt: name ? `${name} (${internalTag})` : internalTag
  }));

  const busy = state.busy !== null;

  return (
    <div className="rounded-2xl overflow-hidden bg-muted relative aspect-[16/9] group">
      {heroUrl ? (
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={t('photos.viewLarge')}
          className="w-full h-full block focus:outline-none"
        >
          <img
            src={heroUrl}
            alt={name ? `${name} (${internalTag})` : internalTag}
            className="w-full h-full object-cover cursor-zoom-in"
          />
          {data.length > 1 ? (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
              <ImageIcon className="h-3 w-3" aria-hidden />
              {t('photos.count', { count: data.length })}
            </span>
          ) : null}
        </button>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
          <AnimalAvatar
            photoUrl={null}
            internalTag={internalTag}
            name={name}
            size={120}
          />
          <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
            <Camera className="h-4 w-4" aria-hidden />
            {t('photos.noPhoto')}
          </p>
        </div>
      )}

      {/* Boton flotante abajo a la derecha para subir foto */}
      <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2">
        {showActions ? (
          <>
            <button
              type="button"
              onClick={() => { setShowActions(false); openFilePicker({ useCamera: true }); }}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-background text-foreground border shadow-lg px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50"
            >
              <Camera className="h-4 w-4" aria-hidden />
              {t('photos.takePhoto')}
            </button>
            <button
              type="button"
              onClick={() => { setShowActions(false); openFilePicker(); }}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-background text-foreground border shadow-lg px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50"
            >
              <ImageIcon className="h-4 w-4" aria-hidden />
              {t('photos.chooseGallery')}
            </button>
          </>
        ) : null}
        <button
          type="button"
          onClick={() => setShowActions(v => !v)}
          aria-label={t('photos.addPhoto')}
          disabled={busy}
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {busy ? (
            <span className="h-5 w-5 border-2 border-current border-r-transparent rounded-full animate-spin" />
          ) : (
            <Plus className={`h-7 w-7 transition-transform ${showActions ? 'rotate-45' : ''}`} aria-hidden />
          )}
        </button>
      </div>

      {state.busy === 'compress' ? (
        <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {t('photos.optimizing')}
        </span>
      ) : state.busy === 'upload' ? (
        <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {t('photos.uploading')}
        </span>
      ) : state.error ? (
        <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
          {state.error}
        </span>
      ) : null}

      <PhotoLightbox
        photos={lightboxPhotos}
        initialIndex={heroIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
