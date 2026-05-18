import { Volume2 } from 'lucide-react';
import { speakNow } from '@/lib/use-voice';
import { cn } from '@/lib/utils';

interface SpeakButtonProps {
  /** Texto que se leera en voz alta. */
  text: string;
  /** Etiqueta accesible del boton; default "Escuchar". */
  ariaLabel?: string;
  className?: string;
}

/**
 * Boton pequeño que lee un texto en voz alta usando la Web Speech API.
 * Siempre habla al ser presionado (ignora la preferencia global del
 * usuario): es una accion explicita.
 */
export function SpeakButton({ text, ariaLabel, className }: SpeakButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? 'Escuchar'}
      onClick={() => speakNow(text)}
      className={cn(
        'inline-flex items-center justify-center h-8 w-8 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <Volume2 className="h-4 w-4" aria-hidden />
    </button>
  );
}
