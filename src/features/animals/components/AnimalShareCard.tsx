/**
 * Este componente muestra una tarjeta resumen del modulo animals.
 */
import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Printer, MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AnimalResponse } from '@/features/animals/types';
import { AnimalAvatar } from '@/components/ui/animal-avatar';
import { BigButton } from '@/components/ui/big-button';
import { Badge } from '@/components/ui/badge';
import { useShareToken } from '@/features/animals/share/api';
import { sexStyle } from '@/features/animals/sex-style';

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
  const { t } = useTranslation('animals');
  const cardRef = useRef<HTMLDivElement>(null);
  const tokenMutation = useShareToken();
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const sx = sexStyle(animal.sex);

  useEffect(() => {
    if (!open) {
      setPublicUrl(null);
      setTokenError(null);
      return;
    }
    let cancelled = false;
    tokenMutation.mutateAsync(animal.id)
      .then(r => {
        if (cancelled) return;
        setPublicUrl(`${window.location.origin}/compartir/animal/${r.shareToken}`);
      })
      .catch(() => {
        if (!cancelled) setTokenError(t('share.linkError'));
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, animal.id]);

  if (!open) return null;

  function shareWhatsApp() {
    if (!publicUrl) return;
    const lines = [
      `*${animal.internalTag}* ${animal.name ? `· ${animal.name}` : ''}`.trim(),
      t('share.sex', { value: t(`sex.${animal.sex}`) }),
      t('share.status', { value: t(`status.${animal.status}`) })
    ];
    if (animal.birthDate) lines.push(t('share.born', { date: animal.birthDate }));
    if (daysInMilk != null) lines.push(t('share.daysInMilk', { days: daysInMilk }));
    if (lastCalving) lines.push(t('share.lastCalving', { date: lastCalving }));
    lines.push('', t('share.statsLink', { url: publicUrl }));
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
            {t('share.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('share.close')}
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
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge tone={animal.sex === 'FEMALE' ? 'pink' : 'graphite'}>
                  {t(`sex.${animal.sex}`)}
                </Badge>
                <span className={`text-xs font-medium ${sx.text}`}>
                  {t(`status.${animal.status}`)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-sm space-y-1">
            {animal.birthDate ? (
              <p><span className="text-muted-foreground">{t('print.rows.birthDate')}:</span> {animal.birthDate}</p>
            ) : null}
            {daysInMilk != null ? (
              <p><span className="text-muted-foreground">{t('publicShare.fields.daysInMilk')}:</span> {daysInMilk}</p>
            ) : null}
            {lastCalving ? (
              <p><span className="text-muted-foreground">{t('print.rows.lastCalving')}:</span> {lastCalving}</p>
            ) : null}
          </div>

          <div className="flex justify-center pt-2">
            {publicUrl ? (
              <QRCodeSVG value={publicUrl} size={140} includeMargin />
            ) : (
              <div className="h-[140px] w-[140px] flex items-center justify-center text-xs text-muted-foreground">
                {t('share.generatingLink')}
              </div>
            )}
          </div>
          {publicUrl ? (
            <p className="text-xs text-center text-muted-foreground break-all">{publicUrl}</p>
          ) : null}
          {tokenError ? (
            <p role="alert" className="text-xs text-center text-destructive">{tokenError}</p>
          ) : null}
          <p className="text-[11px] text-center text-muted-foreground italic">
            {t('share.disclaimer')}
          </p>
        </div>

        <div className="flex justify-between gap-3 print:hidden">
          <BigButton label={t('share.printPdf')} icon={Printer} variant="outline" onClick={printCard} />
          <BigButton label={t('share.whatsapp')} icon={MessageCircle} onClick={shareWhatsApp} disabled={!publicUrl} />
        </div>
      </div>
    </div>
  );
}
