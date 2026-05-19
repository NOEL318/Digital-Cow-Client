/**
 * Este archivo contiene la api cliente del modulo finance/animalSales, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import { toArray } from '@/lib/page';
import type { AnimalSale, AnimalSaleCreate } from './types';

const QK = ['finance', 'animal-sales'] as const;

/**
 * Lista ventas de animales. El backend devuelve Spring `Page<>`;
 * normalizamos a array via `select` para que los consumidores siempre
 * tengan `AnimalSale[]` sin importar el shape del endpoint.
 */
export function useAnimalSales() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<unknown>('/finance/animal-sales')).data,
    select: (data) => toArray<AnimalSale>(data)
  });
}

/** Crea una venta de animal (cambia status SOLD + crea income auto). */
export function useCreateAnimalSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: AnimalSaleCreate) =>
      (await http.post<AnimalSale>('/finance/animal-sales', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animals'] });
      qc.invalidateQueries({ queryKey: ['finance', 'incomes'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'finance'] });
    }
  });
}

/** Actualiza una venta (no permite cambiar animalId). */
export function useUpdateAnimalSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<Omit<AnimalSaleCreate, 'animalId'>> }) =>
      (await http.patch<AnimalSale>(`/finance/animal-sales/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra una venta (revierte status y borra income). */
export function useDeleteAnimalSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/finance/animal-sales/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['animals'] });
      qc.invalidateQueries({ queryKey: ['finance', 'incomes'] });
    }
  });
}
