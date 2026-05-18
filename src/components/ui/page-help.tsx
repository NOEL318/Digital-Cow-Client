import { Info } from 'lucide-react';

interface PageHelpProps {
  /** Texto largo explicativo de qué hace esta página. */
  text: string;
}

/**
 * Pie de página con un texto explicativo. Pensado para pantallas
 * técnicas o poco frecuentes donde hay jerga ganadera o el usuario
 * podría no entender qué hace la pantalla. Si la pantalla es de uso
 * diario, mejor NO usarlo (satura el espacio).
 */
export function PageHelp({ text }: PageHelpProps) {
  return (
    <aside className="mt-10 pt-4 border-t border-dashed text-sm text-muted-foreground max-w-3xl">
      <p className="flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden />
        <span>{text}</span>
      </p>
    </aside>
  );
}
