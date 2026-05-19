/**
 * Este componente muestra una tarjeta resumen del modulo animals.
 */
import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Printer, MessageCircle, X } from 'lucide-react';
import type { AnimalResponse } from '@/features/animals/types';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { BigButton } from '@/components/ui/big-button';

interface AnimalShareCardProps {
  open: boolean;
  animal: AnimalResponse;
  coverPhotoUrl?: string | null;
  daysInMilk?: number | null;
  lastCalving?: string | null;
  onClose: () => void;
}

/**
 * Tarjeta compartible / imprimible del animal. Muestra foto, marca,
 * datos clave y un QR que apunta al URL del detalle, util para
 * colgar en el corral. Tambien permite compartir via WhatsApp con
 * un mensaje pre-armado.
 */
export function AnimalShareCard({
  open, animal, coverPhotoUrl, daysInMilk, lastCalving, onClose
}: AnimalShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const detailUrl = `${window.location.origin}/animales/${animal.id}`;

  function shareWhatsApp() {
    const lines = [
      `*${animal.internalTag}* ${animal.name ? `· ${animal.name}` : ''}`.trim(),
      `Sexo: ${animal.sex === 'FEMALE' ? 'Hembra' : 'Macho'}`,
      `Estado: ${animal.status}`
    ];
    if (animal.birthDate) lines.push(`Nació: ${animal.birthDate}`);
    if (daysInMilk != null) lines.push(`Días en leche: ${daysInMilk}`);
    if (lastCalving) lines.push(`Último parto: ${lastCalving}`);
    lines.push('', `Más info: ${detailUrl}`);
    const url = `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank');
  }

  function printCard() {
    // Abre la pagina imprimible que rinde el reporte completo y
    // auto-dispara el dialogo "Guardar como PDF" del navegador.
    window.open(`/animales/${animal.id}/imprimir`, '_blank');
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 print:bg-white print:p-0"
    >
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-none">
        <header className="flex items-center justify-between print:hidden">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" aria-hidden />
            Compartir / Imprimir
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

        <div ref={cardRef} className="rounded-xl border-2 border-primary p-4 space-y-3 print:border-black">
          <div className="flex items-center gap-3">
            <AnimalAvatar
              photoUrl={coverPhotoUrl ?? undefined}
              internalTag={animal.internalTag}
              name={animal.name}
              size={72}
            />
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold leading-tight">{animal.internalTag}</p>
              {animal.name ? <p className="text-base">{animal.name}</p> : null}
              <p className="text-xs text-muted-foreground">
                {animal.sex === 'FEMALE' ? 'Hembra' : 'Macho'} · {animal.status}
              </p>
            </div>
          </div>

          <div className="text-sm space-y-1">
            {animal.birthDate ? <p><span className="text-muted-foreground">Nació:</span> {animal.birthDate}</p> : null}
            {daysInMilk != null ? <p><span className="text-muted-foreground">Días en leche:</span> {daysInMilk}</p> : null}
            {lastCalving ? <p><span className="text-muted-foreground">Último parto:</span> {lastCalving}</p> : null}
          </div>

          <div className="flex justify-center pt-2">
            <QRCodeSVG value={detailUrl} size={140} includeMargin />
          </div>
          <p className="text-xs text-center text-muted-foreground break-all">{detailUrl}</p>
        </div>

        <div className="flex justify-between gap-3 print:hidden">
          <BigButton label="Imprimir PDF" icon={Printer} variant="outline" onClick={printCard} />
          <BigButton label="WhatsApp" icon={MessageCircle} onClick={shareWhatsApp} />
        </div>
      </div>
    </div>
  );
}
