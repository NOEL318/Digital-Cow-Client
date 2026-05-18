import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { http } from '@/lib/http';

interface UploadState {
  busy: 'compress' | 'upload' | null;
  error: string | null;
}

interface SignResponse {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  tags: string;
  signature: string;
}

interface CloudinaryResp {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
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
      const sig = (await http.post<SignResponse>(`/animals/${animalId}/photos/sign-upload`)).data;

      const form = new FormData();
      form.append('file', compressed);
      form.append('api_key', sig.apiKey);
      form.append('timestamp', String(sig.timestamp));
      form.append('folder', sig.folder);
      form.append('tags', sig.tags);
      form.append('signature', sig.signature);

      const up = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: 'POST', body: form }
      );
      if (!up.ok) throw new Error('upload-failed');
      const data: CloudinaryResp = await up.json();

      await http.post(`/animals/${animalId}/photos/confirm`, {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
        bytes: data.bytes
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
