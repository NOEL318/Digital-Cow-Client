/**
 * Este archivo contiene la api cliente del modulo breeds, con las funciones para llamar al backend y los hooks de react-query.
 */
import { http } from '@/lib/http';

export interface Breed { id: number; code: string; nameEs: string; nameEn: string; category: string; }

// Este objeto agrupa las llamadas al backend del modulo correspondiente.
export const breedsApi = {
  list: () => http.get<Breed[]>('/breeds').then(r => r.data)
};
