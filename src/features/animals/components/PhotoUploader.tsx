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
      const sig = await http.post(`/animals/${animalId}/photos/sign-upload`).then(r => r.data);
      const form = new FormData();
      form.append('file', compressed);
      form.append('api_key', sig.apiKey);
      form.append('timestamp', String(sig.timestamp));
      form.append('folder', sig.folder);
      form.append('tags', sig.tags);
      form.append('signature', sig.signature);
      const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: 'POST', body: form });
      if (!up.ok) throw new Error('upload-failed');
      const data = await up.json();

      await http.post(`/animals/${animalId}/photos/confirm`, {
        publicId: data.public_id, url: data.secure_url,
        width: data.width, height: data.height, bytes: data.bytes
      });
      onUploaded();
    } catch (e: any) {
      const raw = e?.response?.data?.error?.messageKey ?? 'errors:photo.serviceUnavailable';
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
