import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimalAvatarProps {
  /** URL de la foto principal del animal. Opcional. */
  photoUrl?: string | null;
  /** Marca interna del animal (se usa como texto del fallback). */
  internalTag: string;
  /** Nombre del animal (se usa como aria-label). */
  name?: string | null;
  /** Tamaño del avatar en pixeles. Default 40. */
  size?: number;
  className?: string;
}

const COLORS = [
  'bg-teal-700',
  'bg-sky-700',
  'bg-amber-700',
  'bg-purple-700',
  'bg-pink-700',
  'bg-emerald-700',
  'bg-indigo-700',
  'bg-rose-700'
] as const;

function colorFor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i += 1) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

/**
 * Avatar circular del animal. Si hay foto, la muestra; si no, dibuja
 * las iniciales de la marca sobre un color derivado de la propia marca
 * (estable). Tambien cae al fallback si la imagen falla al cargar.
 */
export function AnimalAvatar({
  photoUrl,
  internalTag,
  name,
  size = 40,
  className
}: AnimalAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = useMemo(() => {
    const trimmed = (internalTag ?? '').trim();
    if (!trimmed) return '?';
    const parts = trimmed.split(/[\s-_/]+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [internalTag]);
  const bg = useMemo(() => colorFor(internalTag), [internalTag]);
  const ariaLabel = name ? `${name} (${internalTag})` : internalTag;
  const dimension = { width: size, height: size };
  const fontSize = Math.max(10, Math.round(size * 0.4));

  if (photoUrl && !imageFailed) {
    return (
      <img
        src={photoUrl}
        alt={ariaLabel}
        loading="lazy"
        onError={() => setImageFailed(true)}
        style={dimension}
        className={cn('rounded-full object-cover bg-muted', className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      style={{ ...dimension, fontSize }}
      className={cn(
        'rounded-full flex items-center justify-center text-white font-semibold select-none',
        bg,
        className
      )}
    >
      {initials}
    </div>
  );
}
