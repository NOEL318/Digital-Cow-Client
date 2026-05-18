import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Star, Trash2, Expand } from 'lucide-react';
import { http } from '@/lib/http';
import { Button } from '@/components/ui/button';
import { PhotoLightbox } from '@/components/ui/photo-lightbox';

interface Photo { id: number; url: string }

/**
 * Grid de fotos del animal con acciones rapidas (marcar portada,
 * eliminar) y vista en grande al tocar la foto (lightbox con
 * navegacion por flechas y teclado).
 */
export function PhotoGallery({ animalId }: { animalId: number }) {
  const { t } = useTranslation('animals');
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ['animal-photos', animalId],
    queryFn: () => http.get<Photo[]>(`/animals/${animalId}/photos`).then(r => r.data)
  });
  const remove = useMutation({
    mutationFn: (id: number) => http.delete(`/animals/${animalId}/photos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['animal-photos', animalId] })
  });
  const cover = useMutation({
    mutationFn: (id: number) => http.patch(`/animals/${animalId}/cover-photo/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['animal', animalId] })
  });

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos = list.data ?? [];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((p, i) => (
          <figure key={p.id} className="rounded-xl border overflow-hidden bg-muted relative group">
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label="Ver foto en grande"
              className="block w-full focus:outline-none"
            >
              <img
                src={p.url}
                alt={`Foto ${p.id}`}
                loading="lazy"
                className="w-full h-40 object-cover cursor-zoom-in group-hover:opacity-90 transition-opacity"
              />
              <span className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Expand className="h-3 w-3" aria-hidden />
              </span>
            </button>
            <figcaption className="flex justify-between items-center p-1 text-xs bg-background border-t">
              <Button size="sm" variant="ghost" onClick={() => cover.mutate(p.id)} title={t('photos.setCover')}>
                <Star className="h-3 w-3 mr-1" aria-hidden />
                {t('photos.setCover')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (window.confirm('¿Eliminar esta foto?')) remove.mutate(p.id);
                }}
                title="Eliminar"
              >
                <Trash2 className="h-3 w-3 text-destructive" aria-hidden />
              </Button>
            </figcaption>
          </figure>
        ))}
      </div>

      <PhotoLightbox
        photos={photos.map(p => ({ id: p.id, url: p.url }))}
        initialIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
