import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Pest } from '../types';

/**
 * Lista todas las plagas/parasitos del catalogo.
 */
export function usePests() {
  return useQuery({
    queryKey: ['catalog', 'pests'],
    queryFn: async () => {
      const { data } = await http.get<Pest[]>('/catalog/pests');
      return data;
    },
    staleTime: 1000 * 60 * 60
  });
}
