/**
 * Este hook gestiona la subida de fotos del animal y devuelve estado de progreso y errores.
 */
import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { http } from '@/lib/http';

interface UploadState {
  busy: 'compress' | 'upload' | null;
  error: string | null;
}


/**
 * Hook reutilizable que sube una foto a Cloudinary firmada por el
 * backend y luego la confirma. Compresa la imagen a ~1 MB antes de
 * subir para ahorrar datos en zonas con poca señal.
 *
 * Devuelve un objeto con `state` (estado de la operacion) y dos
 * funciones: `uploadFile(file)` y `openFilePicker(opts)`. El picker
 * abre el dialogo del sistema de archivos o la camara directamente
 * segun la opcion `useCamera`.
 */
export function usePhotoUpload(animalId: number, onUploaded?: () => void) {
  const [state, setState] = useState<UploadState>({ busy: null, error: null });

  async function uploadFile(file: File) {
    setState({ busy: 'compress', error: null });
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true
      });

      setState({ busy: 'upload', error: null });
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
      onUploaded?.();
      setState({ busy: null, error: null });
    } catch (e) {
      const msg = (e as Error)?.message ?? 'No se pudo subir la foto.';
      setState({ busy: null, error: msg });
    }
  }

  function openFilePicker(opts?: { useCamera?: boolean }) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (opts?.useCamera) input.setAttribute('capture', 'environment');
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) uploadFile(file);
    };
    input.click();
  }

  return { state, uploadFile, openFilePicker };
}
