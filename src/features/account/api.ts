/**
 * Este archivo contiene la api cliente de la cuenta (tenant), con los hooks de
 * react-query para leer y actualizar los datos. Al mutar invalida la query para
 * que la vista se refresque en el momento sin recargar la pagina.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface Account {
  name: string;
  defaultLocale: 'es' | 'en';
}

const KEY = ['account'] as const;

/** Datos de la cuenta actual. */
export function useAccount() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await http.get<Account>('/account')).data
  });
}

/** Actualiza la cuenta y refresca la query al terminar. */
export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<Account>) => (await http.patch<Account>('/account', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY })
  });
}
