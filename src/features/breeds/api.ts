import { http } from '@/lib/http';

export interface Breed { id: number; code: string; nameEs: string; nameEn: string; category: string; }

export const breedsApi = {
  list: () => http.get<Breed[]>('/breeds').then(r => r.data)
};
