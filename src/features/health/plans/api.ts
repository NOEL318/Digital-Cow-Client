/**
 * Este archivo contiene la api cliente del modulo health/plans, con las funciones para llamar al backend y los hooks de react-query.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import type {
  HealthPlan,
  HealthPlanCreate,
  HealthPlanStep,
  HealthPlanStepCreate,
  PlanAssignBody,
  AnimalHealthPlan
} from './types';

const QK = ['health', 'plans'] as const;

/** Lista planes sanitarios (cuenta + globales). */
export function useHealthPlans() {
  return useQuery({
    queryKey: QK,
    queryFn: async () => (await http.get<HealthPlan[]>('/health/plans')).data
  });
}

/** Detalle de un plan, incluyendo sus steps. */
export function useHealthPlan(planId: number | undefined) {
  return useQuery({
    queryKey: [...QK, planId],
    queryFn: async () =>
      (await http.get<HealthPlan & { steps: HealthPlanStep[] }>(`/health/plans/${planId}`)).data,
    enabled: !!planId
  });
}

/** Crea un plan sanitario. */
export function useCreateHealthPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: HealthPlanCreate) =>
      (await http.post<HealthPlan>('/health/plans', body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'health'] });
    }
  });
}

/** Actualiza un plan sanitario (no global). */
export function useUpdateHealthPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<HealthPlanCreate> }) =>
      (await http.patch<HealthPlan>(`/health/plans/${id}`, body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'health'] });
    }
  });
}

/** Borra un plan sanitario (no global, sin asignaciones). */
export function useDeleteHealthPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      (await http.delete(`/health/plans/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'health'] });
    }
  });
}

/** Agrega un step a un plan. */
export function useCreatePlanStep(planId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: HealthPlanStepCreate) =>
      (await http.post<HealthPlanStep>(`/health/plans/${planId}/steps`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...QK, planId] })
  });
}

/** Actualiza un step. */
export function useUpdatePlanStep(planId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ stepId, body }: { stepId: number; body: Partial<HealthPlanStepCreate> }) =>
      (await http.patch<HealthPlanStep>(`/health/plans/${planId}/steps/${stepId}`, body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...QK, planId] })
  });
}

/** Borra un step. */
export function useDeletePlanStep(planId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (stepId: number) =>
      (await http.delete(`/health/plans/${planId}/steps/${stepId}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...QK, planId] })
  });
}

/** Asigna un plan a animales y/o lotes. */
export function useAssignPlan(planId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: PlanAssignBody) =>
      (await http.post<AnimalHealthPlan[]>(`/health/plans/${planId}/assign`, body)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...QK, planId] });
      qc.invalidateQueries({ queryKey: ['health', 'alerts'] });
    }
  });
}

/** Borra una asignacion de plan. */
export function useDeletePlanAssignment(planId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (assignmentId: number) =>
      (await http.delete(`/health/plans/${planId}/assignments/${assignmentId}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...QK, planId] })
  });
}
