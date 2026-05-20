/**
 * Cliente del modulo de share publico de animales.
 *
 * - useShareToken: genera o recupera el token publico del animal,
 *   usado por el dueño para construir el enlace de WhatsApp.
 *
 * - publicAnimalShareApi: cliente sin token de autenticacion que
 *   resuelve un share_token a la vista publica de solo lectura.
 *   No usa el cliente http compartido (que adjunta Authorization
 *   y reintenta con refresh en 401) porque la pagina publica puede
 *   abrirla un visitante sin sesion.
 */
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { http } from '@/lib/http';

const baseURL = (import.meta.env.VITE_API_URL ?? '/api/v1') as string;

/** Respuesta del POST /animals/{id}/share-token. */
export interface AnimalShareTokenResponse {
  shareToken: string;
}

/** Punto de pesaje en la vista publica. */
export interface PublicWeighingPoint {
  weighedAt: string;
  weightKg: number;
}

/** Punto de vacunacion en la vista publica. */
export interface PublicVaccinationPoint {
  appliedAt: string;
  vaccineName: string | null;
}

/** Punto de ordeño en la vista publica. */
export interface PublicMilkingPoint {
  milkingDate: string;
  liters: number;
}

/** Respuesta completa del endpoint publico de share. */
export interface PublicAnimalShareResponse {
  internalTag: string;
  name: string | null;
  sex: 'FEMALE' | 'MALE';
  status: string;
  purpose: 'BEEF' | 'DAIRY' | 'DUAL';
  birthDate: string | null;
  birthDateEstimated: boolean;
  ageMonths: number | null;
  breedName: string | null;
  coverPhotoUrl: string | null;
  daysInMilk: number | null;
  lastCalving: string | null;
  weighings: PublicWeighingPoint[];
  vaccinations: PublicVaccinationPoint[];
  milkings: PublicMilkingPoint[];
}

/** Hook que genera o reusa el token publico del animal. */
export function useShareToken() {
  return useMutation({
    mutationFn: async (animalId: number) =>
      (await http.post<AnimalShareTokenResponse>(`/animals/${animalId}/share-token`)).data
  });
}

/**
 * Resuelve un token publico al detalle de solo lectura. No reusa
 * `http` para evitar adjuntar Authorization de una sesion previa que
 * podria llevar al interceptor a intentar refresh sobre un 401 que
 * nunca debe ocurrir en este endpoint publico.
 */
export async function fetchPublicAnimalShare(token: string): Promise<PublicAnimalShareResponse> {
  const { data } = await axios.get<PublicAnimalShareResponse>(
    `${baseURL}/public/animal-share/${encodeURIComponent(token)}`
  );
  return data;
}
