/**
 * Este archivo contiene la api cliente del modulo feeding/plans, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type {
  FeedingPlan, FeedingPlanDetail, FeedingPlanCreate, FeedingPlanItem,
  FeedingPlanItemCreate, LotFeedingPlan, LotAssignBody
} from './types';

const QK = ['feeding', 'plans'] as const;

/** Lista de planes de alimentacion de la cuenta. */
export function useFeedingPlans() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<FeedingPlan[]>('/feeding/plans')).data
  });
}

/** Detalle de un plan con sus items. */
export function useFeedingPlan(planId: number | undefined) {
  return useQuery({
    queryKey: [...QK, planId],
    queryFn: async () =>
      (await http.get<FeedingPlanDetail>(`/feeding/plans/${planId}`)).data,
    enabled: !!planId
  });
}

/** Crea un plan. */
export function useCreateFeedingPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: FeedingPlanCreate) =>
      (await http.post<FeedingPlan>('/feeding/plans', body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Actualiza un plan. */
export function useUpdateFeedingPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<FeedingPlanCreate> }) =>
      (await http.patch<FeedingPlan>(`/feeding/plans/${id}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Borra un plan (solo si no tiene asignaciones activas). */
export function useDeleteFeedingPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/feeding/plans/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK })
  });
}

/** Agrega un insumo al plan. */
export function useAddPlanItem(planId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: FeedingPlanItemCreate) =>
      (await http.post<FeedingPlanItem>(`/feeding/plans/${planId}/items`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...QK, planId] })
  });
}

/** Actualiza un insumo del plan. */
export function useUpdatePlanItem(planId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, body }: { itemId: number; body: Partial<FeedingPlanItemCreate> }) =>
      (await http.patch<FeedingPlanItem>(`/feeding/plans/${planId}/items/${itemId}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...QK, planId] })
  });
}

/** Borra un insumo del plan. */
export function useRemovePlanItem(planId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: number) =>
      (await http.delete(`/feeding/plans/${planId}/items/${itemId}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...QK, planId] })
  });
}

/** Asigna un plan a un lote. */
export function useAssignPlanToLot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: LotAssignBody) =>
      (await http.post<LotFeedingPlan>('/feeding/lot-assignments', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['feeding', 'lot-assignments'] });
    }
  });
}

/** Desasigna un plan (setea unassigned_at). */
export function useUnassignPlanFromLot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (assignmentId: number) =>
      (await http.delete(`/feeding/lot-assignments/${assignmentId}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['feeding', 'lot-assignments'] });
    }
  });
}
