/**
 * Este archivo contiene la api cliente del catalogo de diseases, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type { Disease } from '../types';

/**
 * Lista todas las enfermedades del catalogo.
 */
export function useDiseases() {
  return useQuery({
    queryKey: ['catalog', 'diseases'],
    queryFn: async () => {
      const { data } = await http.get<Disease[]>('/catalog/diseases');
      return data;
    },
    staleTime: 1000 * 60 * 60
  });
}
