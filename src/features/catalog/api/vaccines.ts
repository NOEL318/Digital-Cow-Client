import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Vaccine } from '../types';

/**
 * Lista todas las vacunas del catalogo. Cacheable largo (no cambian con frecuencia).
 */
export function useVaccines() {
  return useQuery({
    queryKey: ['catalog', 'vaccines'],
    queryFn: async () => {
      const { data } = await http.get<Vaccine[]>('/catalog/vaccines');
      return data;
    },
    staleTime: 1000 * 60 * 60
  });
}
