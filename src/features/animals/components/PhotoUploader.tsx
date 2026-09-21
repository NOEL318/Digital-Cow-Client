/**
 * Este componente sube archivos al backend para el modulo animals.
 */
import { useState, type ChangeEvent } from 'react';
import imageCompression from 'browser-image-compression';
import { http } from '@/lib/http';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { toI18nKey } from '@/lib/i18n';

interface Props { animalId: number; onUploaded: () => void; }

/** Componente de subida: drag&drop o camara mobile. */
export function PhotoUploader({ animalId, onUploaded }: Props) {
  const { t } = useTranslation(['animals', 'errors']);
  const toast = useToast();
  const [busy, setBusy] = useState<'compress' | 'upload' | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const original = files[0];
    try {
      setBusy('compress');
      const compressed = await imageCompression(original, { maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true });

      setBusy('upload');
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(compressed);
      });

      await http.post(`/animals/${animalId}/photos/confirm`, {
        publicId: `local-${Date.now()}`,
        url: dataUrl,
        width: 800,
        height: 600,
        bytes: compressed.size
      });
      onUploaded();
    } catch (e) {
      const err = e as { response?: { data?: { error?: { messageKey?: string } } } };
      const raw = err?.response?.data?.error?.messageKey ?? 'errors:photo.serviceUnavailable';
      toast.push(t(toI18nKey(raw)), 'destructive');
    } finally {
      setBusy(null);
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files);

  return (
    <div className="space-y-2">
      <input id="photo-input" type="file" accept="image/*" className="hidden" onChange={onChange} />
      <input id="photo-camera" type="file" accept="image/*" capture="environment" className="hidden" onChange={onChange} />
      <div className="flex gap-2">
        <Button asChild><label htmlFor="photo-input">{t('animals:photos.upload')}</label></Button>
        <Button asChild variant="outline"><label htmlFor="photo-camera">{t('animals:photos.camera')}</label></Button>
      </div>
      {busy === 'compress' && <p className="text-sm text-muted-foreground">{t('animals:photos.compress')}</p>}
      {busy === 'upload' && <p className="text-sm text-muted-foreground">{t('animals:photos.uploading')}</p>}
    </div>
  );
}
